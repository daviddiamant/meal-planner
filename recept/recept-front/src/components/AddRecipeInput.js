import React from 'react';

var debounce = require('debounce');

const AddRecipeInput = ({currentValue, updateValue}) => (
	<input
		className="new-recipe"
		name="new-recipe"
		placeholder="New URL..."
		value={currentValue}
		onChange={
			(e) => {
				debounce(updateValue(e), 200);
			}
		}
	/>
);

export default AddRecipeInput;