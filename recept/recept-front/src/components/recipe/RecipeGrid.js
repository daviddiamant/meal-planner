import React from 'react';
import { Mutation } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import {createWeekRecipe, getAllWeek} from '../../graphql';

const RecipeGrid = ({data, showOptions, imageFailed, handleClick}) => (
	<div className={`recipe-grid ${(showOptions ? 'show-options' : '')}`} onClick={handleClick}>
		<div className="recipe-grid_image-wrapper">
			<img onError={imageFailed} src={data.image} alt={data.title} />
			<div className="recipe-grid_options">
				<Link className="recipe-grid_action recipe-grid_info primary" to={`/recipe/${data.path}`}>
					<FontAwesomeIcon icon="info-circle" />
				</Link>
				<Mutation
					mutation={createWeekRecipe}
					update={
						(cache, { data: { createWeekRecipe } }) => {
							const weekRecipes = cache.readQuery({ query: getAllWeek });
							weekRecipes.week.push(data);
							cache.writeQuery({
								query: getAllWeek,
								data: weekRecipes
							});
						}
					}
					>
					{(createWeekRecipe) => (
						<FontAwesomeIcon
							className="recipe-grid_action recipe-grid_add primary"
							icon="plus-circle"
							onClick={() => {
								createWeekRecipe({ variables: data });
							}}
						/>
					)}
				</Mutation>
			</div>
		</div>
		<h3>
			{data.title}
		</h3>
	</div>
);

export default RecipeGrid;