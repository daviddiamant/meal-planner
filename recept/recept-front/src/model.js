// TODO move to graphql
export function addRecipe (url, callback) {
	const href = `${window.location.protocol}//${window.location.hostname}:443/`;
	fetch(`${href}save?url=${url}`)
		.then((response) => {
			return response.json();
		})
		.then(callback);
}
