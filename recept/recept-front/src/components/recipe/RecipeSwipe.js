import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import {deleteWeekRecipe, getAllWeek} from '../../graphql';

const RecipeSwipe = ({data, showOptions, imageLoaded, imageFailed, imgStyle, mouseUp, mouseDown, mouseOut}) => (
	<div className={`recipe-swipe ${(showOptions ? 'show-options' : '')}`} onMouseDown={mouseDown} onMouseUp={mouseUp} onMouseOut={mouseOut}>
		<div className="recipe-swipe_image-wrapper">
			<img onLoad={imageLoaded} onError={imageFailed} src={data.image} style={imgStyle} alt={data.title} />
			<Mutation
				mutation={deleteWeekRecipe}
				update={
					(cache, { data: { deleteWeekRecipe } }) => {
						const weekRecipes = cache.readQuery({ query: getAllWeek });
						cache.writeQuery({
							query: getAllWeek,
							data: { week: weekRecipes.week.filter(e => e._id !== data._id)}
						});
					}
				}
				>
				{(deleteWeekRecipe) => (
					<FontAwesomeIcon
						className="recipe-swipe_delete"
						icon="times"
						onClick={() => {
							mouseOut()
							deleteWeekRecipe({ variables: {_id: data._id }});
						}}
					/>
				)}
			</Mutation>
			<div className="recipe-swipe_options">
				<Link to={`/recipe/${data.path}`}>
					<FontAwesomeIcon className="recipe-swipe_action recipe-swipe_info primary" icon="info-circle" />
				</Link>
			</div>
		</div>
	</div>
);

export default RecipeSwipe;