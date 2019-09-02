import React from 'react';
import {Link} from 'react-router-dom';

const Header = ({tagline}) => (
	<header>
		<Link to="/">
			<h1 className="text-shadow">
				{tagline}
			</h1>
		</Link>
	</header>
);

export default Header;