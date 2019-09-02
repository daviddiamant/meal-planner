import React from 'react';
import Header from './Header';

const NotFound = () => (
	<div className="container">
		<Header tagline='David & Lovisas kokbok'/>
		<div>
			<h3>Woops!</h3>
			<p>Could not find that for you, please try another url.</p>
		</div>
	</div>
);

export default NotFound;