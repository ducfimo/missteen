const MDB = require('./module/mongodb')
const DATABASE = 'missteen'
const COLLECTION = 'thisinh'

const getInformation = require('./module/getInformation')

const SBD_MIN = 1  // 14
const SBD_MAX = 0  // 2063

let j = 0
for(let i=SBD_MIN;i<=SBD_MAX;i++) {
	getInformation.getHTML(i)
	.then( body => {
		return getInformation.readHTML(body)
	})
	.then( result => {
		if(result==0) return 0
		else return MDB.insertMany(DATABASE, COLLECTION, [result])
	})
	.then( (v) => {
		j++
		if(j%50==0) console.log(j)
		if(j==SBD_MAX-SBD_MIN+1) console.log("end")
	})
	.catch( (e) => {
		console.log(`i = ${i}`, e)
	})
}
