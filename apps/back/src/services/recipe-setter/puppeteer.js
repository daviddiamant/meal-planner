/*global window, document*/
import chromium from "@sparticuz/chromium";
import pupeteerCore from "puppeteer-core";

let puppeteer;

const createBrowser = async () => {
  const pupeteerConfig = process.env.IS_OFFLINE
    ? {
        module: require("puppeteer"),
        path: undefined,
      }
    : {
        module: pupeteerCore,
        path: await chromium.executablePath(),
      };

  puppeteer = await pupeteerConfig.module.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: pupeteerConfig.path,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  return puppeteer;
};

const shouldBlock = (url) => {
  if (
    url.indexOf(".gif") > -1 ||
    url.indexOf(".mov") > -1 ||
    url.indexOf(".mp4") > -1 ||
    url.indexOf("jwplayer") > -1
  ) {
    // No videos
    return true;
  }
  if (url.indexOf("collector.schibsted.io") > -1) {
    return true;
  }
  if (url.indexOf("click.vgnett.no") > -1) {
    return true;
  }
  if (
    url.indexOf("ica") > -1 &&
    (url.indexOf("authorize") > -1 || url.indexOf("authenticate") > -1)
  ) {
    return true;
  }

  return false;
};

// This function will run in the browser, i.e, window and document will be of the page in Puppeteer
const scrapeMetaData = () => {
  const firstNotNull = (priorityArray) => {
    let foundValue = null;
    for (let i = 0; i < priorityArray.length; i++) {
      const priorityItem = priorityArray[i];
      if (!priorityItem.key && priorityItem.value) {
        // We do not have a key, so the item itself is enough
        foundValue = priorityItem.value;
        break;
      } else if (
        priorityItem.key &&
        priorityItem.value &&
        priorityItem.value[priorityItem.key]
      ) {
        // We have a key, so the item is required and that item needs to have that key
        foundValue = priorityItem.value[priorityItem.key];
        break;
      }
    }

    return foundValue;
  };

  const domainSpecificTitle = (domain) => {
    switch (domain) {
      case "www.hemkop.se":
      case "www.javligtgott.se":
        return document.querySelector("h1").innerHTML;
      default:
        return null;
    }
  };

  const domainSpecificImage = (domain, jsonLD) => {
    const domainMap = new Map([
      ["koket.se", jsonLD.image?.replace("thumbnail", "desktop")],
      [
        "blogg.alltommat.se",
        document.querySelector("#content picture source")?.srcset.split(" ")[0],
      ],
      ["javligtgott.se", document.querySelector(".entry img")?.src],
      ["ica.se", jsonLD.image?.replace("cf_6901", "cf_259")],
      ["hemmahosandrea.se", document.querySelector(".wp-post-image")?.src],
      ["marcussamuelsson.se", document.querySelector(".photo")?.src],
      ["polarbrod.se", document.querySelector(".slide img")?.src],
    ]);

    return domainMap.get(domain.replace("www.", ""));
  };

  // First check if we can get some linked data
  let jsonLD = document.querySelector('script[type="application/ld+json"]') || {
    innerHTML: null,
  };
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
  let title = firstNotNull([
    { value: domainSpecificTitle(window.location.hostname) },
    { value: jsonLD, key: "name" },
    {
      value: document.querySelector('meta[itemprop="name"]'),
      key: "content",
    },
    {
      value: document.querySelector('meta[property="og:title"]'),
      key: "content",
    },
    {
      value: document.querySelector('meta[name="og:title"]'),
      key: "content",
    },
    { value: document.querySelector("title"), key: "innerHTML" },
    { value: window.location.href },
  ]);

  // Process the title
  title = title ? title.replace(/(\r\n|\n|\r)/gm, "") : "";
  title = title ? title.replace(/\s\s+/g, " ") : "";

  /***
   * Get the description.
   * Order linked data, og:description, description
   */
  let description = firstNotNull([
    { value: jsonLD, key: "description" },
    {
      value: document.querySelector('meta[property="og:description"]'),
      key: "content",
    },
    {
      value: document.querySelector('meta[name="og:description"]'),
      key: "content",
    },
    {
      value: document.querySelector('meta[property="description"]'),
      key: "content",
    },
    {
      value: document.querySelector('meta[name="description"]'),
      key: "content",
    },
  ]);

  // Process the description
  description = description ? description.replace(/\s\s+/g, " ") : "";

  // Get the keywords - no backup
  let keywords = firstNotNull([
    {
      value: document.querySelector('meta[property="keywords"]'),
      key: "content",
    },
    {
      value: document.querySelector('meta[name="keywords"]'),
      key: "content",
    },
  ]);
  keywords = keywords ? keywords.split(",").map((x) => x.trim()) : [];

  /***
   * Get the image.
   * Order domain specific, linked data, meta image, og:image,largest image
   */
  let image = firstNotNull([
    { value: domainSpecificImage(window.location.hostname, jsonLD) },
    { value: jsonLD.image, key: "url" },
    { value: jsonLD, key: "image" },
    {
      value: document.querySelector('meta[itemprop="image"]'),
      key: "content",
    },
    {
      value: document.querySelector('meta[property="og:image"]'),
      key: "content",
    },
    {
      value: document.querySelector('meta[name="og:image"]'),
      key: "content",
    },
  ]);

  if (!image) {
    // Could not find any image, check the largest at the page
    image = [...document.querySelectorAll("img")].sort((a, b) => {
      return a.naturalHeight < b.naturalHeight ? 1 : -1;
    })[0].src;
  }

  // Process the image
  image = encodeURI(image);

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
};

export const getPuppeteer = () => puppeteer || createBrowser();

export const getPage = async (puppeteer) => {
  const page = await puppeteer.newPage();
  await page.emulate({
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",
    viewport: {
      width: 480,
      height: 812,
      deviceScaleFactor: 3,
    },
  });

  // Block some requests
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const reqUrl = req.url();
    if (reqUrl && shouldBlock(reqUrl)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  return page;
};

export const injectDependencies = async (page) => {
  await page.addScriptTag({
    content: `
      scrapeMetaData = ${scrapeMetaData};
    `,
  });
};
