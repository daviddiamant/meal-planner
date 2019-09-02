
import React from "react";
import Slider from "react-slick";
import { Query } from 'react-apollo';
import Recipe from './recipe/Recipe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'react-bootstrap';
import Button from './Button';

class RecipeSlider extends React.Component {

	constructor (props) {
		super(props);

		this.state = {
			open: false,
			shareTitle: '',
			shareText: '',
			shareHTML: ''
		}
	}

	settings = {
		className: "recipe-slider",
		infinite: true,
		centerPadding: "60px",
		swipeToSlide: true,
		draggable: true,
		arrows: false
	};

	getWeek = (currentDate) => {
		var onejan = new Date(currentDate.getFullYear(), 0, 1);
		return Math.ceil((((currentDate - onejan) / 86400000) + onejan.getDay() + 1) / 7);
	}

	closeModal = (shouldCopy) => {
		this.setState({
			open: false
		});

		if (typeof shouldCopy !== 'undefined' && shouldCopy) {
			// Add share text to clipboard
			var input = document.createElement('textarea');
			input.value = this.state.shareText;

			input.setAttribute('readonly', '');
			input.style = {position: 'absolute', left: '-9999px'};
			document.body.appendChild(input);

			input.select();
			input.setSelectionRange(0, 99999); //For mobile devices

			// Copy
			document.execCommand('copy');
			document.body.removeChild(input);
		}
	}

	shareRecipes = async () => {
		// Get recipes from cache
		const {data : {week : recipes}} = await this.props.client.query({
			query: this.props.query,
			fetchPolicy: 'cache-only'
		});

		if (recipes.length) {
			// Create the share title
			const title = `Dav & Lov matsedel - V.${ this.getWeek(new Date()) }`;

			// Create the share text
			let text = '';
			let html = '';
			recipes.map (recipe => {
				text += `${recipe.title} - ${recipe.url.replace(/\/$/, "")}\n\n`;
				html += `${recipe.title} - <a href="${recipe.url.replace(/\/$/, "")}">${recipe.url.replace(/\/$/, "")}</a><br><br>`;
			});

			text = `${title} \n\n${text.trim()}`;

			// Try via the navigator api - see: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
			try {
				navigator.share({
					title,
					text: text
				})
			} catch (err) {
				// Desktop or unsupported phone
				this.setState({
					open: true,
					shareTitle: title,
					shareText: text,
					shareHTML: {__html: html}
				});
			};
		}
	}

	render() {
		return (
			<Query query={this.props.query} test={this.props.test}>
				{
					({ loading, error, data }) => {
						if (loading) return <p>Loading...</p>;
						if (error) return <p>Error :(</p>;

						const recipes =  data.week.map((recipe, i) => (
							<Recipe key={recipe._id} type="1" data={recipe}/>
						));

						return (
							<React.Fragment>
								<h2 className="grid-header">
									<FontAwesomeIcon className="tertiary mr-10" icon="calendar-week" />
									Veckans recept
									<FontAwesomeIcon className="tertiary mr-10 right btn clear" icon="share-alt" title="Dela" onClick={this.shareRecipes}/>
								</h2>
								<div className="recipe-slider-wrapper">
									<Slider {...this.settings} slidesToShow={Math.min(Math.max(3, this.props.numCols.default), recipes.length)}>
										{recipes}
									</Slider>
									<div className="more-gradient" />
								</div>
								<Modal
									show={this.state.open}
									onHide={this.closeModal}
									size="lg"
									aria-labelledby="contained-modal-title-vcenter"
									centered
								>
									<Modal.Header closeButton>
										<Modal.Title id="contained-modal-title-vcenter">
											<h2 className="left">
												<FontAwesomeIcon className="tertiary mr-10" icon="share-alt" />
												{this.state.shareTitle}
											</h2>
										</Modal.Title>
									</Modal.Header>
									<Modal.Body>
										<p dangerouslySetInnerHTML={this.state.shareHTML}>
										</p>
									</Modal.Body>
									<Modal.Footer>
										<div className="right">
											<Button
												bg="#FFC245"
												tone="dark"
												onClick={() => {this.closeModal(true)}}
												>
												Kopiera och stäng
											</Button>
										</div>
									</Modal.Footer>
								</Modal>
							</React.Fragment>
						);
					}
				}
			</Query>
		);
	}
}

export default RecipeSlider;