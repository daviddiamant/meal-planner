
import React from 'react';
import { Query } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import filenamify from 'filenamify';

import Header from './Header';
import Button from './Button';
import {getOneRecipe} from '../graphql';

class RecipePage extends React.Component {

	constructor (props) {
		super(props);
	}
	render() {
		return (
			<div className="container">
				<Header tagline='David & Lovisas kokbok'/>
				<Query
					query={getOneRecipe}
					variables={{path : this.props.match.params.url}}>
					{({ loading, error, data }) => {
						if (loading) return <p>Loading...</p>;
						if (error) return <p>Error :(</p>;

						const {recipe} = data;

						const url = window.location.hostname.indexOf('localhost') > -1 ? 'egen.kokbok.se' : window.location.hostname;
						const href = `${window.location.protocol}//${url}:443/`;
						const images = [
							(recipe.image != null ? {
								url: `${href}public/${filenamify(recipe.url)}/meta.jpg`,
								alt: 'meta image'
							} : null),
							{
								url: `${href}public/${filenamify(recipe.url)}/screenshot.jpg`,
								alt: 'Screenshot'
							}
						].filter(x => x !== null);

						return (
							<div>
								<h2 className="grid-header">
									<FontAwesomeIcon className="tertiary mr-10" icon="utensils" />
									{recipe.title}
								</h2>
								<Carousel
									dynamicHeight={true}
									showStatus={false}
									swipeScrollTolerance={125}>
									{images.map((img, i) => {
										return (
											<div key={i}>
												<img src={img.url} alt={img.alt}/>
											</div>
										);
									})}
								</Carousel>
								<div className="center">
									<Button
										bg="#FFC245"
										tone="dark"
										>
										<a rel="noopener noreferrer" href={recipe.url} target="_blank">Besök sidan</a>
									</Button>
								</div>
							</div>
						);
					}}
				</Query>
			</div>
		);
	}
}

export default RecipePage;