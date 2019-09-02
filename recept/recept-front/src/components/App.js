import React from 'react';
import Masonry from 'react-masonry-css';
import { Query } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Spinner from './Spinner';
import Header from './Header';
import Recipe from './recipe/Recipe';
import AddRecipeInput from './AddRecipeInput';
import FloatingButton from './FloatingButton';
import RecipeSlider from './RecipeSlider';
import {addRecipe, getAllRecipes, getAllWeek} from '../graphql';

var debounce = require('debounce');

class App extends React.Component {

	constructor (props) {
		super(props);

		this.endOfRecipes = React.createRef();

		// Inital state
		this.state = {
			numCols: {default: 4},
			newUrl: '',
			loadingNewURL: 0,
			newURLError: false,
			recipeFloatingOpen: false,
			test: 1
		}
	}

	componentDidMount = () => {
		this.setColumns(window.innerWidth);
		window.addEventListener(
			"resize",
			() => debounce(this.setColumns(window.innerWidth), 200)
		);
	}

	setColumns = (width) => {
		const lims = [
			{width: 992, numCols: 4},
			{width: 768, numCols: 3},
			{width: 576, numCols: 2}
		];

		let numCols = {default: 1};
		lims.some(lim => {
			if (width >= lim.width){
				numCols = {default: lim.numCols}
				return true;
			}
			return false;
		});

		this.setState({
			numCols
		});
	}

	changeUrl = (e) => {
		const newUrl = e.target.value;
		this.setState({
			newUrl
		});
	}

	handleAddRecipe = async () => {
		let recipeFloatingOpen = this.state.recipeFloatingOpen;
		if (!recipeFloatingOpen) {
			this.toggleAddRecipe(recipeFloatingOpen);
		}
		else {
			// Mark as started adding
			this.setState({
				loadingNewURL: 1
			});
			// Do not show spinner right away, wait 500ms
			setTimeout(() => {
				if(this.state.loadingNewURL === 1) {
					this.setState({
						loadingNewURL: 2
					});
				}
			}, 500);

			// Add the recipe
			const addedStatus = await this.props.client.mutate({
				mutation: addRecipe,
				variables: {url: this.state.newUrl}
			}).catch(e => {return {'addRecipe': 'error'}});

			const newURLError = (addedStatus.data.addRecipe === 'error') ? true : false;

			// Close
			this.toggleAddRecipe(recipeFloatingOpen);

			// Reset state
			this.setState({
				newUrl: '',
				loadingNewURL: 0,
				newURLError
			});

			if (newURLError) {
				// Remove the red bouncning
				setTimeout(() => {
					this.setState({
						newURLError: !newURLError
					});
				}, 500);
			}
			else {
				await this.props.client.query({
					query: getAllRecipes,
					fetchPolicy: 'network-only'
				});
				this.endOfRecipes.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
			}
		}
	}

	toggleAddRecipe = (recipeFloatingOpen) => {
		recipeFloatingOpen = !recipeFloatingOpen;
		this.setState({
			recipeFloatingOpen
		});
	}

	render() {
		return (
			<div className="container">
				<Header tagline='David & Lovisas kokbok'/>
				<RecipeSlider client={this.props.client} numCols={this.state.numCols} query={getAllWeek} test={this.state.test}/>
				<h2 className="grid-header">
					<FontAwesomeIcon className="tertiary mr-10" icon="utensils" />
					Alla recept
				</h2>
				<Query query={getAllRecipes}>
					{({ loading, error, data }) => {
						if (loading) return <p>Loading...</p>;
						if (error) return <p>Error :(</p>;

						const recipes =  data.recipes
							.filter(recipe => recipe.title != null)
							.map((recipe, i) => (
							<Recipe key={recipe._id} type="0" data={recipe}/>
						));

						return (
							<div>
								<Masonry
									breakpointCols={this.state.numCols}
									className="masonry-grid"
									columnClassName="masonry-grid_column">
									{recipes}
								</Masonry>
							</div>
						);
					}}
				</Query>
				<FloatingButton
					opened = {this.state.recipeFloatingOpen}
					closedIcon = {
						<FontAwesomeIcon icon="plus"/>
					}
					openIcon = {
						(this.state.loadingNewURL === 2 ? <Spinner /> : <p>Add</p>)
					}
					onClick = {this.handleAddRecipe}
					hiddenContent = {
						<AddRecipeInput
						currentValue = {this.state.newUrl}
						updateValue = {this.changeUrl}/>
					}
					bg="#FFC245"
					tone="dark"
					ownClass={`add-recipe ${(this.state.newURLError ? 'show-error' : '')}`}
				/>
				<span ref={this.endOfRecipes}/>
			</div>
		);
	}
}

export default App;