import Fastify from "fastify";
import fastifyCors from "fastify-cors";

// Local imports
import helpers from "./utilities/helpers.js";
import mainController from "./routes/mainController.js";
import mongoConnector from "./utilities/mongoConnector.js";
import puppeteerLauncher from "./utilities/puppeteerLauncher.js";
import firebase from "./utilities/firebase.js";

// Set up the server
const fastify = Fastify({
  ignoreTrailingSlash: true,
  maxParamLength: 200,
  pluginTimeout: 120000,
});

// Add utilities - will be attached to the Fastify instance
fastify.register(fastifyCors, { origin: "https://egen.kokbok.se:3000" });
fastify.register(mongoConnector);
fastify.register(puppeteerLauncher);
fastify.register(firebase);
fastify.register(helpers);

// Register the routes
fastify.register(mainController, { prefix: "api/" });

// Where are the images served?
const imagePrefix = "/recipe-images/";
fastify.decorate("imagePrefix", imagePrefix);

// Start the server
fastify.listen(8080, "127.0.0.1", (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`server listening on ${address}`);

  // Stop the server
  const stop = async () => {
    await fastify.close();
  };
  process.on("SIGINT", stop);
  process.on("SIGQUIT", stop);
  process.on("SIGTERM", stop);
});
