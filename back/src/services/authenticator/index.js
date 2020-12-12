import * as Sentry from "@sentry/serverless";
import firebase from "firebase-admin";

import { initLambdaSentry } from "../../common/sentry";
import { getUser } from "./service";
import serviceAccount from "./serviceAccountKey.json";

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_ADMIN_URL,
});
initLambdaSentry();

const getJWT = (event) => {
  let JWT;
  try {
    JWT = event.authorizationToken || null;
    JWT = JWT.split(" ");
    JWT = JWT[0] === "Bearer" ? JWT[1] : null;
  } catch (error) {
    JWT = null;
  }
  return JWT;
};

const generatePolicy = (principalId, user, localUser, effect, resource) => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: `${resource.split("/")[0]}/*`,
      },
    ],
  },
  context: {
    uid: user.uid,
    ...localUser,
  },
});

export const authenticate = Sentry.AWSLambda.wrapHandler(
  async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const JWT = getJWT(event);
    if (!JWT) {
      throw new Error("Invalid token");
    }

    let user;
    try {
      user = await firebase.auth().verifyIdToken(JWT);
    } catch (error) {
      throw new Error("Unauthorized");
    }

    if (!user?.uid) {
      throw new Error("Unauthorized");
    }

    const localUser = await getUser(user.uid);

    return generatePolicy("user", user, localUser, "Allow", event.methodArn);
  }
);
