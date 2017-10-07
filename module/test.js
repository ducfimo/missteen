const VNS = require('./VietnameseString')
const STR = require('./string')
const MDB = require('./mongodb')

let str = '  nguyỄn NgọC đỨC  \n'
console.log(VNS.removeVietnamese(str))
console.log(STR.standardize(str))
console.log(STR.standardizeName(str))
console.log(STR.removeVietnamese(str))
console.log(STR.toVietnamese(STR.removeVietnamese(str)).length)

MDB.find('test', 'col')
.then( result => {
	console.log(result)
})
