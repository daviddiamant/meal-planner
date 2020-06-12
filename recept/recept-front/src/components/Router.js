import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import App from './App';
import NotFound from './NotFound';
import RecipePage from './RecipePage';

const Router = ({client}) => (
	<BrowserRouter>
		<Switch>
			<Route exact path='/' render={(props) => <App {...{...props, client}}/>}/>
			<Route exact path='/recipe/:url' render={(props) => <RecipePage {...{...props, client}}/>}/>
			<Route component={NotFound}/>
		</Switch>
	</BrowserRouter>
);

export default Router;