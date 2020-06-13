import fp from "fastify-plugin";
import mongoDB from "fastify-mongodb";

const connector = fp((fastify, _, done) => {
  fastify.register(mongoDB, {
    forceClose: true,
    url: "mongodb://127.0.0.1:27017/meal-planner",
  });

  done();
});

export default connector;
