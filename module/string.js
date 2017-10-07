const VNS = require('./VietnameseString')

const standardize = str => {
	let temp = str.match(/(\S)+/g)
	if(!temp) return ''
	else return temp.join(' ')
}

const standardizeName = name => {
	let str = name.replace('-', ' - ')
	str = str.replace('(', ' ( ')
	let temp = str.match(/(\S)+/g)
	if(!temp) return ''
	else return temp.map( element => element.slice(0,1).toUpperCase() + element.slice(1).toLowerCase()).join(' ')
}

const removeVietnamese = VNS.removeVietnamese

const toVietnamese = VNS.toVietnamese

module.exports = {
	standardize,
	standardizeName,
	removeVietnamese,
	toVietnamese
}