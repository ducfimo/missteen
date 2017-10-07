const MongoClient = require('mongodb').MongoClient
const DB_URL_BEGIN = 'mongodb://localhost:27017/'

const find = (database, collection, conditions = {}, options = {_id: 0}) => {
	return MongoClient.connect(DB_URL_BEGIN + database)
	.then( (db) => {
		let col = db.collection(collection)
		return col.find(conditions, options).toArray()
		.then( (result) => {
			db.close()
			return result
		})
	})
}

const insertMany = (database,collection,data) => {
	return MongoClient.connect(DB_URL_BEGIN + database)
	.then( (db) => {
		let col = db.collection(collection)
		return col.insertMany(data)
		.then( (result) => {
			db.close()
			return result
		})
	})
}

module.exports = {
	find,
	insertMany
}