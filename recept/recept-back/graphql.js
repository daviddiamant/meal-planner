const {ApolloServer, gql} = require('apollo-server-express');
const mongo = require('./mongodb');
const helpers = require('./helpers');

/**
 * All mutations are handled the same way so this only needs to be typed once
 */
const generalMutation = (mutationFunction, args) => {
	return mutationFunction(args)
		.then(({res}) => {
			return res;
		})
		.catch(e => {
			console.log(e)
			return 'error';
		});
}

/**
 * All get all querys are handled the same way too
 */
const generalGetAll = (type) => {
	return mongo.getAll(type)
		.then(({res}) => {
			return res;
		})
		.catch(e => {
			throw new Error(e);
		});
}

const typeDefs = [gql`
	type Recipe {
		_id: ID!
		title: String
		keywords: [String]
		image: String
		url: String
		path: String
	}

	type Query {
		recipe(path: String): Recipe
		recipes: [Recipe]
		week: [Recipe]
	}

	type Mutation {
		addRecipe(url: String): String
		createRecipe(title: String, keywords: [String], image: String, url: String): Recipe
		createWeekRecipe(_id: ID, title: String, keywords: [String], image: String, url: String, path: String): Recipe
		deleteWeekRecipe(_id: ID): String
	}

	schema {
		query: Query
		mutation: Mutation
	}
`];

const resolvers = {
	Query: {
		recipe: (root, {path}) => {
			return mongo.getOneUrl(path)
				.then(res => res)
				.catch(e => {
					throw new Error(e);
				});
		},
		recipes: async () => {
			return generalGetAll('recipes');
		},
		week: () => {
			return generalGetAll('week');
		}
	},
	Mutation: {
		addRecipe: (root, args) => {
			return generalMutation(helpers.save, args);
		},
		createRecipe: (root, args) => {
			return generalMutation(mongo.insertDocument, args);
		},
		createWeekRecipe: (root, args) => {
			return generalMutation(mongo.insertToWeek, args);
		},
		deleteWeekRecipe: (root, args) => {
			return generalMutation(mongo.removeFromWeek, args);
		}
	}
}

module.exports = {
	getSchema: () => {
		return new ApolloServer({
			typeDefs,
			resolvers,
			playground: {
				endpoint: '/graphql',
				settings: {
					'editor.theme': 'light'
				}
			}
		})
	}
}