import React from 'react';
import ApolloClient from "apollo-boost";
import filenamify from 'filenamify';
import localForage from 'localforage';

import { render } from 'react-dom';
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';

import './css/style.css';
import './css/responsive.css';
import './css/bootstrap.css';
import {getAllWeek, getOneRecipe} from './graphql';

import Router from './components/Router';


// Font Awesome icons used in app
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faInfoCircle,
	faPlusCircle,
	faPlus,
	faUtensils,
	faCalendarWeek,
	faTimes,
	faShareAlt
} from '@fortawesome/free-solid-svg-icons';
library.add(faInfoCircle, faPlusCircle, faPlus, faUtensils, faCalendarWeek, faTimes, faShareAlt);

// Check for service worker support
if ('serviceWorker' in navigator) {
	// Register it
	navigator.serviceWorker.register('/serviceworker.js');
}

// Set up the Apollo Boost client with cache
const url = window.location.hostname.indexOf('localhost') > -1 ? 'egen.kokbok.se' : window.location.hostname;
const href = `${window.location.protocol}//${url}:443/`;
const cache = new InMemoryCache();
const persistedCache = persistCache({
  cache,
  storage: window.localStorage,
});

const client = new ApolloClient({
	uri: `${href}graphql`,
	cache
});

// Pre-fetch the recipes in the planned week, so that they will always be awailable offline
client.query({
	query: getAllWeek,
	fetchPolicy: 'network-only'
}).then(async res => {
	const recipes = res.data.week || [];

	const weekRecipes = localForage.createInstance({
		name: 'weekRecipes'
	});
	await weekRecipes.clear();

	recipes.map(recipe => {
		const path = recipe.path || false;

		if (path) {
			// Save these in indexedDB so that the service worker can cache accordingly
			weekRecipes.setItem(filenamify(recipe.url), true);

			// Fetch recipe (for single recipe page)
			client.query({
				query: getOneRecipe,
				variables: {path},
				fetchPolicy: 'network-only'
			});

			// Also fetch its screenshot
			const url = window.location.hostname.indexOf('localhost') > -1 ? 'egen.kokbok.se' : window.location.hostname;
			const href = `${window.location.protocol}//${url}:443/public/${filenamify(recipe.url)}/screenshot.jpg`;

			const weekCache = caches.open('weekImages').then(weekCache => {
				weekCache.match(href).then(cacheMatch => {
					if (cacheMatch === undefined) {
						// We have not fetched this image
						fetch(href);
					}
				});
			});
		}
	});
});


persistedCache.then(() => {
	render((
		<ApolloProvider client={client}>
			<Router client={client}/>
		</ApolloProvider>
	), document.querySelector('#main'));
});
