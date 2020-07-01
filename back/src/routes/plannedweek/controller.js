import plannedWeekModel from "./model.js";
import { addSchema, getAllSchema, removeSchema } from "./schema.js";

const plannedWeekController = (fastify, _, done) => {
  const model = new plannedWeekModel(fastify);

  // Url to add a recipe to the planned week
  fastify.route({
    method: "POST",
    url: "/add",
    schema: addSchema,
    handler: async (req, res) => {
      const slug = req.body.value || "";
      const JWT = fastify.getJWT(req);

      if (!slug || !JWT) {
        res.code(400).send({ result: "Not enough info to add!" });
        return res;
      }

      // We have a slug and a user - add it!
      const added = await model.addToWeek(JWT, slug);
      if (!added) {
        res.code(400).send({ result: "Could not plan recipe:(" });
        return res;
      }

      res.send({ result: true });
    },
  });

  // Url to remove a recipe from the planned week
  fastify.route({
    method: "POST",
    url: "/remove",
    schema: removeSchema,
    handler: async (req, res) => {
      const slug = req.body.value || "";
      const JWT = fastify.getJWT(req);

      if (!slug || !JWT) {
        res.code(400).send({ result: "Not enough info to remove!" });
        return res;
      }

      // We have a slug and a user - remove it!
      const removed = await model.removeFromWeek(JWT, slug);
      if (!removed) {
        res.code(400).send({ result: "Could not remove recipe:(" });
        return res;
      }

      res.send({ result: true });
    },
  });

  // Url to get all planned recipes
  fastify.route({
    method: "GET",
    url: "/",
    schema: getAllSchema,
    handler: async (req, res) => {
      const JWT = fastify.getJWT(req);

      if (!JWT) {
        res.code(400).send({ result: "Not enough cred!" });
        return res;
      }

      // We have a user - get the week!
      const plannedWeek = await model.getWeek(JWT);
      if (!plannedWeek) {
        res.code(400).send({ result: "Could not get planned week!" });
        return res;
      }

      res.send(plannedWeek);
    },
  });

  done();
};

export default plannedWeekController;
