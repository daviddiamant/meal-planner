import { uploadImage } from "../../common/s3";
import { notifyImageSaver, notifyJsonLDParser } from "../../common/sqs";
import { slugify } from "../../common/utils";
import { alreadyAdded, alreadyAddedBySlug, saveRecipe } from "./DAL";
import {
  getNetworkIdleType,
  getPage,
  getPuppeteer,
  injectDependencies,
} from "./puppeteer";

export const addRecipe = async (bookID, url) => {
  if (await alreadyAdded(bookID, url)) {
    return false;
  }

  let { recipe, screenshot } = await scrapeRecipe(url);
  const slug = await getAvailableSlug(bookID, recipe.title);
  const folderName = process.env.S3_IMAGE_BUCKET_FOLDER_NAME;
  recipe = {
    ...recipe,
    url,
    slug,
    bookID,
    screenshot: `/${folderName}/${slug}/screenshot.jpeg`,
  };

  await uploadImage(slug, "screenshot.jpeg", screenshot);

  const inserted = await saveRecipe(recipe);
  if (!inserted.insertedId) {
    return false;
  }

  if (recipe.image) {
    await notifyImageSaver(inserted.insertedId, slug, recipe.image);
  }

  if (recipe.jsonLD) {
    await notifyJsonLDParser(inserted.insertedId, recipe.jsonLD);
  }

  return true;
};

const getAvailableSlug = async (bookID, title) => {
  let slugified = slugify(title);

  let taken = await alreadyAddedBySlug(bookID, slugified);
  if (taken) {
    let tries = 1;
    let newSlugified = null;
    do {
      newSlugified = `${slugified}-${tries}`;
      taken = await alreadyAddedBySlug(bookID, newSlugified);
      tries++;
    } while (taken);

    slugified = newSlugified;
  }

  return slugified;
};

const scrapeRecipe = async (url) => {
  const puppeteer = await getPuppeteer();
  const page = await getPage(puppeteer);

  try {
    await page.goto(url, {
      timeout: 120000,
      waitUntil: ["load", getNetworkIdleType(url)],
    });
    await page.waitForSelector("body");
  } catch (err) {
    await page.close();
    throw err;
  }

  await injectDependencies(page);

  const recipe = await page.evaluate(`scrapeMetaData()`);

  await page.setViewport({
    width: recipe.screenshotWidth,
    height: recipe.screenshotHeight,
  });
  const screenshot = await page.screenshot({
    type: "jpeg",
    quality: 100,
    clip: {
      x: 0,
      y: 0,
      width: recipe.screenshotWidth,
      height: recipe.screenshotHeight,
    },
  });

  await page.close();

  return { recipe, screenshot };
};
