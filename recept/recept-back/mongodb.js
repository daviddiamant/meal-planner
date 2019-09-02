const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/recipes';

const dbName = 'recipes';

// In case the db changes, we only need to change here instead of all places calling this
const toTable = {
	week: 'week',
	recipes: 'recipes'
}

const performAction = (data, action) => {
	MongoClient.connect(url, async (err, db) => {
		await action(data, db);
		db.close();
	});
}

const createPath = (db, title) => {
	const helpers = require('./helpers');
	let path = encodeURI(helpers.slugify(title));

	return checkPath(db, path);
}

const checkPath = (db, path) => {
	return new Promise((resolve, reject) => {
		db.collection('recipes').findOne({path}, (err, res) => {
			if (err) reject('Couldnt check!');
			if (res !== null) {
				// Exists
				path += Math.floor(Math.random() * 10);
				checkPath(db, path)
					.then(newPath => resolve(newPath))
					.catch(e => reject(e));
			}
			else {
				// Does not exists
				resolve(path);
			}
		});
	});
}

/**
 * Public api
 * The general idea is that these functions performs an operation on MongoDB
 * and returns a promise that will be resolved/rejected.
 */
module.exports = {
	insertDocument: (data) => {
		return new Promise((resolve, reject) => {
			performAction(url, async (url, db) => {
				await createPath(db, data.title)
					.then(async path => {
						const result = await db.collection('recipes').insertOne({...data, path}).catch(e => reject(e));
						if (result.insertedCount) {
							resolve({res: {_id : result.insertedId, ...data, path}});
						}
						else {
							reject('Didnt insert');
						}
					})
					.catch(e => reject(e));
			});
		});
	},
	insertToWeek: (data) => {
		return new Promise((resolve, reject) => {
			performAction(url, async (url, db) => {
				const result = await db.collection('week').insertOne(data).catch(e => reject(e));
				if (result) {
					resolve({res: {_id : result.insertedId, ...data}});
				}
				else {
					reject('Didnt insert');
				}
			});
		});
	},
	removeFromWeek: (_id) => {
		return new Promise((resolve, reject) => {
			performAction(url, async (url, db) => {
				const result = await db.collection('week').remove(_id).catch(e => reject(e));
				resolve({res: 'removed' + _id._id});
			});
		});
	},
	checkRecipe: (url) => {
		return new Promise((resolve) => {
			performAction(url, async (url, db) => {
				db.collection('recipes').findOne({url}, (err, res) => {
					if (err) throw err;
					if (res !== null) {
						resolve({status: true});
					}
					else {
						resolve({status: false});
					}
				});
			});
		});
	},
	getOneUrl: (path) => {
		return new Promise((resolve, reject) => {
			performAction(path, (path, db) => {
				db.collection('recipes').findOne({path}, (err, res) => {
					if (err) reject('Couldnt find any!');
					if (res !== null) {
						resolve(res);
					}
					else {
						reject('Couldnt find any!');
					}
				});
			});
		});
	},
	getAll: (type) => {
		return new Promise((resolve, reject) => {
			performAction(url, (url, db) => {
				db.collection(toTable[type]).find({}).toArray((err, res) => {
					if (err) {
						reject(err);
					}
					else if (res != null && res.length) {
						resolve({res});
					}
					else {
						reject('Could not find any!');
					}
				});
			});
		});
	}
}