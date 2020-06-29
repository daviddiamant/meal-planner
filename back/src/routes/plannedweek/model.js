import Ajv from "ajv";
import { recipesForLists } from "../mainSchema.js";

class plannedWeekModel {
  constructor(fastify) {
    const db = fastify.mongo.db;

    this.verifyJWT = fastify.verifyJWT;

    this.weekIDsCollection = db.collection("weekIDs");
    this.recipeCollection = db.collection("recipes");
    this.plannedRecipesCollection = db.collection("plannedRecipes");
  }

  async getWeekID(uID) {
    // Get week ID from uID (multiple users can have the same week)
    let weekID = await this.weekIDsCollection
      .find({ uID }, { projection: { weekID: 1, _id: 0 } })
      .next();
    weekID = weekID || uID;
    weekID = typeof weekID.weekID !== "undefined" ? weekID.weekID : weekID;

    return weekID;
  }

  async addToWeek(JWT, slug) {
    // Get recipe from slug - if the slug is invalid we do not have to check user
    const recipe = await this.recipeCollection.find({ slug }).next();

    if (!recipe) {
      return false;
    }

    // Verify JWT and get uID
    const user = await this.verifyJWT(JWT);
    if (!user || !user.uid) {
      return false;
    }

    const weekID = this.getWeekID(user.uid);

    // Filter recipe
    const _id = recipe._id;
    const ajv = new Ajv({ removeAdditional: true });
    const validate = ajv.compile({
      additionalProperties: false,
      ...recipesForLists.items,
    });
    validate(recipe);
    recipe._id = _id;

    // Add recipe to week
    let inserted;
    try {
      inserted = await this.plannedRecipesCollection.insertOne({
        ...recipe,
        weekID,
      });
    } catch (error) {
      return false;
    }

    return inserted.insertedCount > 0;
  }

  async getWeek(JWT) {
    // Verify JWT and get uID
    const user = await this.verifyJWT(JWT);
    if (!user || !user.uid) {
      return false;
    }

    const weekID = this.getWeekID(user.uid);

    const plannedRecipes = await this.plannedRecipesCollection
      .find({ weekID }, { projection: { _id: 0 } })
      .toArray();

    return plannedRecipes;
  }
}

export default plannedWeekModel;
