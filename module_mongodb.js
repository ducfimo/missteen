const MongoClient = require('mongodb').MongoClient
const DB_URL_BEGIN = 'mongodb://localhost:27017/'

module.exports = {
	find : function(database, collection, conditions = {}) {
		return MongoClient.connect(DB_URL_BEGIN + database).then( (db) => {
			let col = db.collection(collection)
			return col.find(conditions, {_id:0}).toArray().then( (results) => {
				db.close()
				return results
			})
		})
	},
	insertMany: function(database,collection,data) {
		return MongoClient.connect(DB_URL_BEGIN + database).then( (db) => {
			let col = db.collection(collection)
			return col.insert(data).then( (results) => {
				db.close()
				return results
			})
		})
	}
}