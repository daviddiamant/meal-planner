import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';

import App from './App';
import NotFound from './NotFound';
import RecipePage from './RecipePage';

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

// Set up the Apollo Boost client with cache
const href = `${window.location.protocol}//${window.location.hostname}:443/`;
const cache = new InMemoryCache();
const client = new ApolloClient({
	uri: `${href}graphql`,
	cache
});

const Router = () => (
	<ApolloProvider client={client}>
		<BrowserRouter>
			<Switch>
				<Route exact path='/' render={(props) => <App {...{...props, client}}/>}/>
				<Route exact path='/recipe/:url' render={(props) => <RecipePage {...{...props, client}}/>}/>
				<Route component={NotFound}/>
			</Switch>
		</BrowserRouter>
	</ApolloProvider>
);

export default Router;