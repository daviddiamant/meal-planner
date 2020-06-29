import admin from "firebase-admin";
import fp from "fastify-plugin";
import fs from "fs";
import path from "path";

const firebase = fp((fastify, _, done) => {
  const serviceAccount = JSON.parse(
    fs.readFileSync(
      path.join(path.resolve(), "serviceAccountKey.json"),
      "utf-8"
    )
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://meal-planner-71347.firebaseio.com",
  });

  // Add JWT verification to the fastify instance
  fastify.decorate("verifyJWT", async (JWT) => {
    let user;
    try {
      user = await admin.auth().verifyIdToken(JWT);
    } catch (error) {
      user = null;
    }

    return user;
  });

  done();
});

export default firebase;
