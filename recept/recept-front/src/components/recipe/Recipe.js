import React from 'react';
import filenamify from 'filenamify';

import RecipeGrid from './RecipeGrid';
import RecipeSwipe from './RecipeSwipe';

class Recipe extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			type: props.type,
			data: props.data,
			clicked: false,
			imgStyle: {},
			mouse: 0,
			mouseCord: {}
		}
	}

	addDefaultSrc = (e) => {
		e.target.src = e.target.src.replace('meta.jpg', 'screenshot.jpg');
	}

	imageLoaded = (e) => {
		e.persist();

		const styleHigh = {
			width: '100%',
			height: 'auto'
		}

		const styleWide = {
			width: 'auto',
			height: '100%'
		}

		const height = e.target.naturalHeight;
		const width = e.target.naturalWidth;

		let imgStyle = {}
		if ((width/height) <= 1.2) {
			imgStyle = styleHigh;
		}
		else {
			imgStyle = styleWide
		}
		this.setState({
			imgStyle
		});
	}

	showOptions = () => {
		const clicked = !this.state.clicked;
		this.setState({
			clicked
		});
	}

	mouseDown = (e) => {
		e.persist();
		this.setState({
			mouse: 1,
			mouseCord: {x: e.clientX, y: e.clientY}
		});
	}

	mouseUp = (e) => {
		e.persist();
		let mouse = this.state.mouse;

		if (mouse === 1
			&& Math.abs(this.state.mouseCord.x - e.clientX) < 10
			&& Math.abs(this.state.mouseCord.y - e.clientY) < 10) {
			this.showOptions(e);
		}
		mouse = 0;

		this.setState({
			mouseCord: {},
			mouse
		});
	}

	mouseOut = () => {
		this.setState({
			mouse: 0,
			mouseCord: {}
		});
	}

	closeOptions = () => {
		const clicked = false;
		this.setState({
			clicked
		});
	}

	render() {
		let data = {...this.props.data};

		let image = '';
		const url = window.location.hostname.indexOf('localhost') > -1 ? 'egen.kokbok.se' : window.location.hostname;
		const href = `${window.location.protocol}//${url}:443/`;
		if (data.url != null && data.image != null) {
			image = `${href}public/${filenamify(data.url)}/meta.jpg`;
		}
		else{
			image = `${href}public/${filenamify(data.url)}/screenshot.jpg`;
		}
		data.image = image;

		let RecipeComponent = null;
		switch (this.state.type) {
			case "0":
				// In the masonry grid
				RecipeComponent = RecipeGrid;
				break;
			case "1":
				// In slider
				RecipeComponent = RecipeSwipe;
				break;
			default:
				// Lets default to the masonry grid
				RecipeComponent = RecipeGrid;
				break;
		}

		return (
			<RecipeComponent
				data={data}
				showOptions={this.state.clicked}
				closeOptions={this.closeOptions}
				imageLoaded={this.imageLoaded}
				imageFailed={this.addDefaultSrc}
				imgStyle={this.state.imgStyle}
				handleClick={this.showOptions}
				mouseUp={this.mouseUp}
				mouseDown={this.mouseDown}
				mouseOut={this.mouseOut}
			/>
		);
	}
}

export default Recipe;