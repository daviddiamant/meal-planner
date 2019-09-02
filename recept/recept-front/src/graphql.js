
/**
 * This file contains all the GraphQL-queries - can be imported from here
 */

import gql from "graphql-tag";

export const getAllRecipes = gql`
	query {
		recipes {
			_id
			title
			keywords
			image
			url
			path
		}
	}
`;

export const getAllWeek = gql`
	query {
		week {
			_id
			title
			keywords
			image
			url
			path
		}
	}
`;

export const getOneRecipe = gql`
	query recipe($path: String!){
		recipe(path: $path) {
			_id
			title
			keywords
			image
			url
			path
		}
	}
`;

export const addRecipe = gql`
	mutation AddRecipe($url: String!){
		addRecipe(url: $url)
	}
`;

export const createWeekRecipe = gql`
	mutation CreateWeekRecipe($_id: ID!, $title: String, $keywords: [String], $image: String, $url: String){
		createWeekRecipe(_id: $_id, title: $title, keywords: $keywords, image: $image, url: $url) {
			_id
			title
			keywords
			image
			url
		}
	}
`;

export const deleteWeekRecipe = gql`
	mutation DeleteWeekRecipe($_id: ID!){
		deleteWeekRecipe(_id: $_id)
	}
`;