import { AWSLambda } from "@sentry/serverless";
import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import { initLambdaSentry } from "../../common/sentry";
import { getUser } from "./service";
import serviceAccount from "./serviceAccountKey.json";

const firebaseApp = initializeApp({
  credential: credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_ADMIN_URL,
});
initLambdaSentry();

const getJWT = (event) => {
  try {
    const authToken = event.authorizationToken || null;
    const authTokenParts = authToken.split(" ");

    return authTokenParts[0] === "Bearer" ? authTokenParts[1] : null;
  } catch (error) {
    return null;
  }
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

export const authenticate = AWSLambda.wrapHandler(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const JWT = getJWT(event);
  if (!JWT) {
    throw new Error("Invalid token");
  }

  try {
    const user = await getAuth(firebaseApp).verifyIdToken(JWT);

    if (!user?.uid) {
      throw new Error("Unauthorized");
    }

    const localUser = await getUser(user.uid);

    return generatePolicy("user", user, localUser, "Allow", event.methodArn);
  } catch (error) {
    throw new Error("Unauthorized");
  }
});
