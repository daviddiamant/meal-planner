import recipesModel from "./model.js";
import { addSchema, getAllSchema, getOneSchema } from "./schema.js";

const recipesController = (fastify, _, done) => {
  const model = new recipesModel(fastify);

  // Utility route that is used to update the recipes in the db
  fastify.route({
    method: "GET",
    url: "/fix-recipes",
    handler: async (req, res) => {
      await model.fixRecipes();

      res.send({ res: true });
    },
  });

  // Url to get all recipes
  fastify.route({
    method: "GET",
    url: "/",
    schema: getAllSchema,
    handler: async (req, res) => {
      const recipes = await model.getAllRecipes();

      res.send(recipes);
    },
  });

  // Url to add recipes
  fastify.route({
    method: "POST",
    url: "/add",
    schema: addSchema,
    handler: async (req, res) => {
      const url = req.body.value || "";
      if (!url || !fastify.validURL(url)) {
        res.code(400).send({ result: "Faulty URL!" });
        return res;
      }

      // We have a url and its valid - add it!
      const added = await model.addRecipe(url);
      if (!added) {
        res.code(400).send({ result: "Could not add recipe" });
        return res;
      }

      res.send({ result: true });
    },
  });

  // Url to one recipe
  fastify.route({
    method: "GET",
    url: "/:slug",
    schema: getOneSchema,
    handler: async ({ params: { slug } }, res) => {
      const recipe = await model.getRecipeBySlug(slug);

      res.send(recipe);
    },
  });

  done();
};

export default recipesController;
