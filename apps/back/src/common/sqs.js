import { SQS } from "aws-sdk";

const sendMessage = async (QueueUrl, body) => {
  const sqs = new SQS();
  await sqs
    .sendMessage({
      MessageBody: JSON.stringify(body),
      QueueUrl,
    })
    .promise();
};

export const notifyJsonLDParser = async (recipeId, jsonLD) => {
  const QueueUrl = process.env.LOCAL
    ? process.env.LOCAL_JSONLD_SQS
    : process.env.JSON_LD_QUEUE_URL;

  await sendMessage(QueueUrl, {
    recipeId,
    jsonLD,
  });
};

export const notifyImageSaver = async (recipeId, slug, imageUrl) => {
  const QueueUrl = process.env.LOCAL
    ? process.env.LOCAL_SAVE_IMAGE_SQS
    : process.env.SAVE_IMAGE_QUEUE_URL;

  await sendMessage(QueueUrl, {
    recipeId,
    slug,
    imageUrl,
  });
};
