const puppeteer = require('puppeteer');
const mkdirp = require('mkdirp');
const fs = require('fs');
const axios = require('axios');
var mongo = require('./mongodb');
const filenamify = require('filenamify');

/**
 * This function does the actual parsing of meta data.
 * First looks at the og properties and fallbacks to regular meta tags.
 * If no meta data could be found the url will be used
 * @return obj(string, array, string)
 */
const getMetaData = async (page, url) => {
	let title = await page.evaluate(() => "" + document.querySelector('meta[property="og:title"]').content).catch(e => null);
	if(!title) {
		// Could not find a og:title - check for regular title
		title = await page.evaluate(() => "" + document.querySelector('title').innerHTML).catch(e => null);
	}
	if (!title) {
		// Couldnt find any title - use url
		title = url;
	}

	let keywords = await page.evaluate(() => document.querySelector('meta[name="keywords"]').content.split(',')).catch(e => []);
	keywords = keywords.map(keyword => keyword.trim());

	let image = await page.evaluate(() => "" + document.querySelector('meta[property="og:image"]').content).catch(e => null);

	return {
		title,
		keywords,
		image
	};
}

const download = async (uri, path) => {
	const writer = fs.createWriteStream(path);

	const response = await axios({
		url: uri,
		method: 'GET',
		responseType: 'stream'
	})

	response.data.pipe(writer)

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve)
		writer.on('error', reject)
	})
}

const validURL = (url) => {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return !!pattern.test(url);
}

// Public api
module.exports = {
	/**
	 * This function saves a recipe locally.
	 * An entry in MongoDB, a screenshot of the recipe and possibly the meta image
	 * @return Promise(string)
	 */
	save: ({url}) => {
		return new Promise(async (resolve, reject) => {
			// Is it even an URL?
			if (!validURL(url)) {
				reject({res: "Not a valid URL"});
			}

			const res = await mongo.checkRecipe(url);
			if (typeof res.status !== 'undefined' && !res.status) {
				// This recipe is new - save it

				// Amp up pupeteer for the screenshot
				const browser = await puppeteer.launch({
					args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless', '--disable-gpu'],
					executablePath: '/usr/bin/chromium-browser'
				});
				const page = await browser.newPage();
				await page.goto(url).catch(e => {
					reject({res: "Could not load the URL"});
				});
				await page.setViewport({
					width: 480,
					height: 1000,
					deviceScaleFactor: 1
				});

				// Wait - in order to make sure the page is displayed fully
				await page.waitFor(1000);

				const folder = `screenshots/${filenamify(url)}`;
				await mkdirp(folder, async (err) => {
					if (err) {
						reject({res: "Could not create the folder."});
					}
					else{
						const metaData = await getMetaData(page, url);

						if (metaData.image != null) {
							// We have a metadata image, save it
							await download(metaData.image, folder + '/meta.jpg')
								.catch(e => {
									reject({res: "Could not download the image."});
								});
							// Classify image and update keywords
							// Use tensorflow js
						}

						// Save it in Mongo
						const inserted = await mongo.insertDocument({...metaData, url}).catch(e => {
							reject({res: "Could not save to db."});
						});

						// Try to take a screenshot of the page itself
						await page.screenshot(
						{
							path: folder + '/screenshot.jpg',
							fullPage: true
						}).catch(e => {
							reject({res: "Could not complete the screenshot"});
						});
					}
					await browser.close();
					resolve({res: "Success"});
				});
			}
			else {
				reject({res: "URL is already present in db"});
			}
		});
	},
	/**
	 * Creates sutible url paths
	 * @return string
	 */
	slugify: (string) => {
		if (string != null) {
			const a = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;';
			const b = 'aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------';
			const p = new RegExp(a.split('').join('|'), 'g');

			return string.toString().toLowerCase()
				.replace(/\s+/g, '-') // Replace spaces with -
				.replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
				.replace(/&/g, '-och-') // Replace & with 'och'
				.replace(/[^\w\-]+/g, '') // Remove all non-word characters
				.replace(/\-\-+/g, '-') // Replace multiple - with single -
				.replace(/^-+/, '') // Trim - from start of text
				.replace(/-+$/, ''); // Trim - from end of text
		}
		return '';
	}
}