import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export const uploadImage = async (slug, fileName, body) => {
  const s3 = new S3({
    region: process.env.S3_IMAGE_REGION,
    accessKeyId: process.env.S3_IMAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_IMAGE_SECRET_ACCESS_KEY,
  });
  const v = process.env.S3_IMAGE_VERSION;
  const folderName = process.env.S3_IMAGE_BUCKET_FOLDER_NAME;

  await new Upload({
    client: s3,

    params: {
      Bucket: process.env.S3_IMAGE_BUCKET,
      Key: `${v}/${folderName}/${slug}/${fileName}`,
      Body: body,
      ContentType: `image/${
        fileName.includes("png")
          ? "png"
          : fileName.includes("jpg") || fileName.includes("jpeg")
          ? "jpeg"
          : null
      }`,
      CacheControl: "max-age=2592000",
    },
  }).done();
};
