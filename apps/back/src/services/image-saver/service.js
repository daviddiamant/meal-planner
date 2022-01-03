import fetch from "node-fetch";
import Vibrant from "node-vibrant";
import sharp from "sharp";

import { recipesDAL } from "../../common/DAL";
import { uploadImage } from "../../common/s3";

const smallImageSize = 200;
const mediumImageSize = 400;

const resizeAndUpload = async (
  baseInstance,
  slug,
  targetImageName,
  targetWidth
) => {
  const sharpInstance = await baseInstance
    .clone()
    .resize({
      width: targetWidth,
    })
    .pipe(sharp());

  const image = await sharpInstance.toBuffer();
  await uploadImage(slug, targetImageName, image);

  const imageMeta = await sharpInstance.metadata();

  return [imageMeta.width, imageMeta.height];
};

const saveAllSizes = async (imageBuffer, extension, slug) => {
  const imageName = `image.${extension}`;
  const smallImageName = `image-small.${extension}`;
  const mediumImageName = `image-medium.${extension}`;

  // Save the original image
  await uploadImage(slug, imageName, imageBuffer);

  const sharpInstance = sharp(imageBuffer);
  const imageMeta = await sharpInstance.metadata();
  const [imageWidth, imageHeight] = [imageMeta.width, imageMeta.height];

  // Save the medium image
  const [mediumImageWidth, mediumImageHeight] = await resizeAndUpload(
    sharpInstance,
    slug,
    mediumImageName,
    mediumImageSize
  );

  // Save the small image
  const [smallImageWidth, smallImageHeight] = await resizeAndUpload(
    sharpInstance,
    slug,
    smallImageName,
    smallImageSize
  );

  // Get the palette from Vibrant
  const v = new Vibrant(imageBuffer);
  const palette = await v.getPalette();
  let reducedPalette = {};
  for (const colorName of Object.keys(palette)) {
    reducedPalette[colorName] = palette[colorName]["_rgb"];
  }

  const folderName = process.env.S3_IMAGE_BUCKET_FOLDER_NAME;
  return {
    image: `/${folderName}/${slug}/${imageName}`,
    smallImage: `/${folderName}/${slug}/${smallImageName}`,
    mediumImage: `/${folderName}/${slug}/${mediumImageName}`,
    imageWidth,
    imageHeight,
    smallImageWidth,
    smallImageHeight,
    mediumImageWidth,
    mediumImageHeight,
    imagePalette: reducedPalette,
  };
};

export const processImage = async (recipeId, imageUrl, slug) => {
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse) {
    return;
  }

  const contentType = imageResponse.headers.get("content-type");
  if (!imageResponse.headers.get("content-type").includes("image")) {
    return;
  }

  const extension = contentType.split("/").at(-1);
  const imageArrayBuffer = await imageResponse.arrayBuffer();
  const imageBody = Buffer.from(new Uint8Array(imageArrayBuffer));

  const imageMeta = await saveAllSizes(imageBody, extension, slug);
  const { updateRecipe } = recipesDAL();
  await updateRecipe(recipeId, imageMeta);
};
