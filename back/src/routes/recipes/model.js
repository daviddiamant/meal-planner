import Axios from "axios";
import sharp from "sharp";
import Vibrant from "node-vibrant";
import sanitizeHtml from "sanitize-html";
import { createWriteStream, mkdirSync, promises as fsAsync } from "fs";
import { resolve } from "path";
import { PassThrough } from "stream";

class recipesModel {
  constructor(fastify) {
    this.smallImageSize = 200;
    this.mediumImageSize = 400;

    this.puppeteer = fastify.puppeteer;
    this.firstNotNull = fastify.firstNotNull;
    this.slugify = fastify.slugify;
    this.imagePrefix = fastify.imagePrefix;

    const db = fastify.mongo.db;
    this.collection = db.collection("recipes");
  }

  async fixRecipes() {
    const allRecipes = await this.collection.find({}).toArray();

    for (let recipe of allRecipes) {
      const haveInstructions =
        recipe && recipe.jsonLD && recipe.jsonLD.recipeInstructions;
      let instructions = haveInstructions
        ? recipe.jsonLD.recipeInstructions
        : false;
      // Process the instructions
      instructions = await this.getInstructionsFromJSONLinkedData(
        instructions,
        recipe.title
      );
      // Update the db
      await this.collection.updateOne(
        { _id: recipe["_id"] },
        {
          $set: {
            instructions,
            "jsonLD.recipeInstructions": [],
          },
        }
      );
    }
    console.log("done");
  }

  async getRecipeBySlug(slug) {
    const findRes = this.collection
      .find({ slug }, { projection: { _id: 0 } })
      .next();

    return findRes;
  }

  async getAllRecipes() {
    const findRes = await this.collection
      .find({}, { projection: { _id: 0 } })
      .toArray();

    return findRes;
  }

  async addRecipe(url) {
    const findRes = await this.collection.find({ url }).toArray();
    const isInDb = findRes.length > 0;
    if (isInDb) {
      // This has been added before
      return false;
    }

    // Set up a headless browser
    const page = await this.puppeteer.newPage();
    await page.emulate({
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
      viewport: {
        width: 375,
        height: 812,
        deviceScaleFactor: 3,
      },
    });

    // Block some requests so that we can scrape
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const reqUrl = req.url();
      if (reqUrl && !this.domainSpecificRequestOk(reqUrl)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Visit the recipe
    try {
      const idle2Host = ["www.javligtgott.se", "www.mat.se"].includes(
        new URL(url).hostname
      );
      const networkIdleType = idle2Host ? "networkidle2" : "networkidle0";
      await page.goto(url, {
        timeout: 120000,
        waitUntil: ["load", networkIdleType],
      });
      await page.waitFor("body");
    } catch (err) {
      await page.close();
      throw err;
    }

    // Pass functions that we need on the page
    await page.addScriptTag({
      content: `
				firstNotNull = ${this.firstNotNull};
				function ${this.scrapeMetaData};
				function ${this.domainSpecificTitle};
				function ${this.domainSpecificImage}`,
    });

    // SCRAPE it!
    // eslint-disable-next-line no-undef
    let metaData = await page.evaluate(() => scrapeMetaData());
    const slug = await this.slugify(metaData.title, this.collection);

    // Where to save images
    const basePath = resolve(resolve(), "recipe-images", slug);
    mkdirSync(basePath, { recursive: true });

    // Take a screenshot
    await page.setViewport({
      width: metaData.screenshotWidth,
      height: metaData.screenshotHeight,
    });
    await page.screenshot({
      path: resolve(basePath, "screenshot.jpeg"),
      quality: 75,
      clip: {
        x: 0,
        y: 0,
        width: metaData.screenshotWidth,
        height: metaData.screenshotHeight,
      },
    });
    metaData.screenshot = `${this.imagePrefix}${slug}/screenshot.jpeg`;

    // We are done with the browser page
    await page.close();

    // Fetch image
    if (metaData.image) {
      const imgResp = await Axios({
        url: metaData.image,
        method: "GET",
        responseType: "stream",
      });
      if (
        imgResp &&
        imgResp.headers["content-type"] &&
        imgResp.headers["content-type"].indexOf("image") > -1
      ) {
        const imageMeta = await this.saveRecipeImage(imgResp, basePath, slug);

        metaData = {
          ...metaData,
          ...imageMeta,
        };
      }
    }

    // We are done - save this recipe in db
    const inserted = await this.collection.insertOne({
      url,
      slug,
      ...metaData,
    });

    // Do stuff that the user do not have to wait for
    console.log("return");
    this.addRecipeCleanUp(inserted);

    return true;
  }

  async addRecipeCleanUp(inserted) {
    if (!inserted.insertedId) {
      // We the id to continue
      return null;
    }

    const haveIngredients =
      inserted &&
      inserted.ops &&
      inserted.ops[0] &&
      inserted.ops[0].jsonLD &&
      inserted.ops[0].jsonLD.recipeIngredient;
    let ingredients = haveIngredients
      ? inserted.ops[0].jsonLD.recipeIngredient
      : false;
    const haveInstructions =
      inserted &&
      inserted.ops &&
      inserted.ops[0] &&
      inserted.ops[0].jsonLD &&
      inserted.ops[0].jsonLD.recipeInstructions;
    let instructions = haveInstructions
      ? inserted.ops[0].jsonLD.recipeInstructions
      : false;

    // Process the ingredients
    if (ingredients) {
      // Use a reg-ex to divide the ingredients and the units into two separate parts
      const regexForUnits = /(^(ev|eventuellt|kanske|valfritt|\s)*(\d|en|ett|två|tre|fyra|fem|sex|sju|åtta|nio|tio|några|nått|någon|något|[\u00BC-\u00BE\u2150-\u215E]|ca|cirka|ungefär|ung|typ|ish|nästan)+(\d|\/|\.|,|\s|dussin|tjog|rågat|stor|liten|medelstor|mellan|[\u00BC-\u00BE\u2150-\u215E]|-)*)(knyte|knyten|ark|skiva|skivor|stjälk|stjälkar|kvist|kvistar|sats|satsar|halv|hel|klyfta|klyftor|kruka|krukor|flaska|flaskor|ask|askar|paket|förpackning|förpackningar|förp|pack|påse|påsar|portion|portioner|port|burk|burkar|kopp|koppar|mugg|muggar|glas|sked|skedar|nypa|nypor|näve|nävar|handfull|skopa|skopor|trave|travar|st|stycken|kg|hg|g|gr|kilo|kilon|kilogram|hekto|hekton|hektogram|gram|l|liter|dl|deciliter|ml|milliliter|cl|centiliter|krm|kryddmått|krm|tsk|tesked|teskedar|dsk|dessertsked|dessertskedar|msk|matsked|matskedar|kkp|kaffekopp|kaffekoppar|cm|centimeter)?\s+/gm;
      ingredients = ingredients.map((ingredient) => {
        let unit = ingredient.match(regexForUnits);
        unit = unit ? unit[0].trim() : unit;

        return unit
          ? { unit, ingredient: ingredient.substring(unit.length).trim() }
          : { unit: "", ingredient };
      });
    }
    ingredients = ingredients || {};

    // Process the instructions
    instructions = await this.getInstructionsFromJSONLinkedData(
      instructions,
      inserted.ops[0].title
    );

    // Update the db
    await this.collection.updateOne(
      { _id: inserted.insertedId },
      {
        $set: {
          ingredients,
          "jsonLD.recipeIngredient": [],
          instructions,
          "jsonLD.recipeInstructions": [],
        },
      }
    );
  }

  async getInstructionsFromJSONLinkedData(instructions, baseTitle) {
    let newInstructions = [];
    if (instructions) {
      /**
       * Should be array(object(array()))
       * sections(sectionName, instruction(text))
       * */
      if (
        (typeof instructions[0] === "object" ||
          typeof instructions[0] === "function") &&
        instructions[0] !== null
      ) {
        // We have a list of objects
        let baseInstructions = [];
        for (const instruction of instructions) {
          if (instruction["@type"] === "HowToStep") {
            baseInstructions = [...baseInstructions, instruction.text];
          } else if (instruction["@type"] === "HowToSection") {
            const section = await this.getInstructionsFromJSONLinkedData(
              instruction.itemListElement,
              baseTitle
            );

            if (section[0]) {
              section[0].name =
                instruction.name || baseTitle || "Instruktioner";

              newInstructions = [...newInstructions, section[0]];
            }
          }
        }

        if (baseInstructions.length) {
          const recRes = await this.getInstructionsFromJSONLinkedData(
            baseInstructions,
            baseTitle
          );

          newInstructions = [
            ...newInstructions,
            {
              name: baseTitle || "Instruktioner", // Since this is just a list of instructions, we do not have one
              instructions: recRes[0].instructions || null,
            },
          ];
        }
      } else if (Array.isArray(instructions)) {
        // Its a list of strings
        newInstructions = [
          {
            name: baseTitle || "Instruktioner", // Since this is just a list of strings, we do not have one
            instructions: await Promise.all(
              instructions.map(async (x) => {
                const recRes = await this.getInstructionsFromJSONLinkedData(
                  x,
                  baseTitle
                );

                return recRes[0].instructions[0] || null;
              })
            ),
          },
        ];
      } else {
        // It is just a string
        newInstructions = [
          {
            name: baseTitle || "Instruktioner", // Since this is a string, we do not have one
            instructions: [
              sanitizeHtml(instructions, {
                allowedTags: [],
                allowedAttributes: {},
              }),
            ],
          },
        ];
      }
    }
    instructions = newInstructions;
    instructions = instructions || {};

    return instructions;
  }

  // This function will run in the browser, i.e, window and document will be of the page in Puppeteer
  scrapeMetaData() {
    // First check if we can get some linked data
    // eslint-disable-next-line no-undef
    let jsonLD = document.querySelector(
      'script[type="application/ld+json"]'
    ) || { innerHTML: null };
    try {
      jsonLD = JSON.parse(jsonLD.innerHTML);
    } catch (_) {
      jsonLD = {};
    }
    jsonLD = jsonLD ? jsonLD : {};
    jsonLD = jsonLD.length
      ? jsonLD.filter((x) => x["@type"] === "Recipe")[0]
      : jsonLD;
    jsonLD = jsonLD ? jsonLD : {};
    jsonLD = jsonLD["@type"] !== "Recipe" ? {} : jsonLD;

    /***
     * Get the title.
     * Order domain specific, linked data, meta title, og:title, title, url
     */
    // eslint-disable-next-line no-undef
    let title = firstNotNull([
      // eslint-disable-next-line no-undef
      { value: domainSpecificTitle(window.location.hostname) },
      { value: jsonLD, key: "name" },
      {
        // eslint-disable-next-line no-undef
        value: document.querySelector('meta[itemprop="name"]'),
        key: "content",
      },
      {
        // eslint-disable-next-line no-undef
        value: document.querySelector('meta[property="og:title"]'),
        key: "content",
      },
      {
        // eslint-disable-next-line no-undef
        value: document.querySelector('meta[name="og:title"]'),
        key: "content",
      },
      // eslint-disable-next-line no-undef
      { value: document.querySelector("title"), key: "innerHTML" },
      // eslint-disable-next-line no-undef
      { value: window.location.href },
    ]);

    // Process the title
    title = title ? title.replace(/(\r\n|\n|\r)/gm, "") : "";
    title = title ? title.replace(/\s\s+/g, " ") : "";

    /***
     * Get the description.
     * Order linked data, og:description, description
     */
    // eslint-disable-next-line no-undef
    let description = firstNotNull([
      { value: jsonLD, key: "description" },
      {
        // eslint-disable-next-line no-undef
        value: document.querySelector('meta[property="og:description"]'),
        key: "content",
      },
      {
        // eslint-disable-next-line no-undef
        value: document.querySelector('meta[name="og:description"]'),
        key: "content",
      },
      {
        // eslint-disable-next-line no-undef
        value: document.querySelector('meta[property="description"]'),
        key: "content",
      },
      {
        // eslint-disable-next-line no-undef
        value: document.querySelector('meta[name="description"]'),
        key: "content",
      },
    ]);

    // Process the description
    description = description ? description.replace(/\s\s+/g, " ") : "";

    // Get the keywords - no backup
    // eslint-disable-next-line no-undef
    let keywords = firstNotNull([
      {
        // eslint-disable-next-line no-undef
        value: document.querySelector('meta[property="keywords"]'),
        key: "content",
      },
      {
        // eslint-disable-next-line no-undef
        value: document.querySelector('meta[name="keywords"]'),
        key: "content",
      },
    ]);
    keywords = keywords ? keywords.split(",").map((x) => x.trim()) : [];

    /***
     * Get the image.
     * Order domain specific, linked data, meta image, og:image,largest image
     */
    // eslint-disable-next-line no-undef
    let image = firstNotNull([
      // eslint-disable-next-line no-undef
      { value: domainSpecificImage(window.location.hostname, jsonLD) },
      { value: jsonLD, key: "image" },
      {
        // eslint-disable-next-line no-undef
        value: document.querySelector('meta[itemprop="image"]'),
        key: "content",
      },
      {
        // eslint-disable-next-line no-undef
        value: document.querySelector('meta[property="og:image"]'),
        key: "content",
      },
      {
        // eslint-disable-next-line no-undef
        value: document.querySelector('meta[name="og:image"]'),
        key: "content",
      },
    ]);

    if (!image) {
      // Could not find any image, check the largest at the page
      // eslint-disable-next-line no-undef
      image = [...document.querySelectorAll("img")].sort((a, b) => {
        return a.naturalHeight < b.naturalHeight ? 1 : -1;
      })[0].src;
    }

    // Process the image
    image = encodeURI(image);

    // eslint-disable-next-line no-undef
    const body = document.querySelector("body");
    return {
      title,
      description,
      keywords,
      image,
      jsonLD,
      screenshotHeight: body.scrollHeight,
      screenshotWidth: body.offsetWidth,
    };
  }

  async saveRecipeImage(imgResp, basePath, slug) {
    // Fix the file paths
    const extension = imgResp.headers["content-type"].split("/").pop();
    const imageName = `image.${extension}`;
    const smallImageName = `image-small.${extension}`;
    const mediumImageName = `image-medium.${extension}`;
    const imagePath = resolve(basePath, imageName);
    const smallImagePath = resolve(basePath, smallImageName);
    const mediumImagePath = resolve(basePath, mediumImageName);

    // Create copy for sharp
    const imageCopyForSharp = new PassThrough();
    await imgResp.data.pipe(imageCopyForSharp);

    // Save the original image
    await imgResp.data.pipe(createWriteStream(imagePath));

    // Create the main sharp pipeline
    const sharpPipeline = sharp();
    imageCopyForSharp.pipe(sharpPipeline);
    const imageMeta = await sharpPipeline.clone().metadata();
    const [imageWidth, imageHeight] = [imageMeta.width, imageMeta.height];

    // Save the small image
    const smallPipeline = await this.saveOtherSizeRecipeImage({
      sharpPipeline,
      srcPath: imagePath,
      targetPath: smallImagePath,
      srcWidth: imageWidth,
      targetWidth: this.smallImageSize,
    });
    const smallImageMeta = await smallPipeline.metadata();
    const [smallImageWidth, smallImageHeight] = [
      smallImageMeta.width,
      smallImageMeta.height,
    ];

    // Save the medium image
    const mediumPipeline = await this.saveOtherSizeRecipeImage({
      sharpPipeline,
      srcPath: imagePath,
      targetPath: mediumImagePath,
      srcWidth: imageWidth,
      targetWidth: this.mediumImageSize,
    });
    const mediumImageMeta = await mediumPipeline.metadata();
    const [mediumImageWidth, mediumImageHeight] = [
      mediumImageMeta.width,
      mediumImageMeta.height,
    ];

    // Get the palette from Vibrant
    const v = new Vibrant(imagePath);
    const palette = await v.getPalette();
    let reducedPalette = {};
    for (const colorName of Object.keys(palette)) {
      reducedPalette[colorName] = palette[colorName]["_rgb"];
    }

    return {
      image: `${this.imagePrefix}${slug}/${imageName}`,
      smallImage: `${this.imagePrefix}${slug}/${smallImageName}`,
      mediumImage: `${this.imagePrefix}${slug}/${mediumImageName}`,
      imageWidth,
      imageHeight,
      smallImageWidth,
      smallImageHeight,
      mediumImageWidth,
      mediumImageHeight,
      imagePalette: reducedPalette,
    };
  }

  async saveOtherSizeRecipeImage({
    sharpPipeline,
    srcPath,
    targetPath,
    srcWidth,
    targetWidth,
  }) {
    let pipelineClone = sharpPipeline.clone();

    if (srcWidth > targetWidth) {
      pipelineClone = await pipelineClone
        .resize({ width: targetWidth })
        .pipe(sharp());
      await pipelineClone.pipe(createWriteStream(targetPath));
    } else {
      // We do not need to save it again since it is already smaller than target
      // Just create a symlink
      await fsAsync.symlink(srcPath, targetPath);
    }

    return pipelineClone;
  }

  domainSpecificTitle(domain) {
    switch (domain) {
      case "www.hemkop.se":
      case "www.javligtgott.se":
        // eslint-disable-next-line no-undef
        return document.querySelector("h1").innerHTML;
      default:
        return null;
    }
  }

  domainSpecificImage(domain, jsonLD) {
    switch (domain) {
      case "www.koket.se":
        return jsonLD.image.replace("thumbnail", "desktop");
      case "blogg.alltommat.se":
        // eslint-disable-next-line no-undef
        return document
          .querySelector("#content picture source")
          .srcset.split(" ")[0];
      case "www.javligtgott.se":
        // eslint-disable-next-line no-undef
        return document.querySelector(".entry img").src;
      case "www.ica.se":
        return jsonLD.image.replace("cf_6901", "cf_259");
      case "hemmahosandrea.se":
        // eslint-disable-next-line no-undef
        return document.querySelector(".wp-post-image").src;
      case "marcussamuelsson.se":
        // eslint-disable-next-line no-undef
        return document.querySelector(".photo").src;
      default:
        return null;
    }
  }

  domainSpecificRequestOk(url) {
    if (
      url.indexOf(".gif") > -1 ||
      url.indexOf(".mov") > -1 ||
      url.indexOf(".mp4") > -1 ||
      url.indexOf("jwplayer") > -1
    ) {
      // No video
      return false;
    }
    if (url.indexOf("collector.schibsted.io") > -1) {
      return false;
    }
    if (url.indexOf("click.vgnett.no") > -1) {
      return false;
    }
    if (
      url.indexOf("ica") > -1 &&
      (url.indexOf("authorize") > -1 || url.indexOf("authenticate") > -1)
    ) {
      return false;
    }
    return true;
  }
}

export default recipesModel;
