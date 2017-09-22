const VN = require('./module_tiengViet')

const standardize = (string) => {
	let temp = string.match(/(\S)+/g)
	if(!temp) return ''
	else return temp.join(' ')
}

const standardizeName = (name) => {
	let str = name.replace("-", " - ")
	str = str.replace("(", " ( ")
	let temp = str.match(/(\S)+/g)
	if(!temp) return ''
	else return temp.map(v=>v.slice(0,1).toUpperCase()+v.slice(1).toLowerCase()).join(' ')
}

const removeVietnamese = str => VN.removeVietnamese(str)

module.exports = {
	standardize,
	standardizeName,
	removeVietnamese
}