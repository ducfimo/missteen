const VN = require('./module_tiengViet')

const standardize = (string) => {
	let str = string
	let i = 0
	let j = str.length - 1
	while(str.charAt(i)==" " || str.charAt(i)=="\n") {
		i++
	}
	while(str.charAt(j)==" " || str.charAt(j)=="\n") {
		j--
	}
	str = str.substring(i, j+1)
	for(let k=0;k<str.length;k++) {
		if(str.charAt(k)==" ") {
			let l = k
			while(str.charAt(l)==' ') {
				l++
			}
			str = str.substring(0,k+1) + str.substring(l)
		}
	}
	return str
}

const standardizeName = (name) => {
	let str = standardize(name).toLowerCase()
	str = str.replace("-", " - ")
	str = str.replace("(", " ( ")
	str = standardize(str)
	str = str.charAt(0).toUpperCase() + str.substring(1)
	for(let i=1;i<str.length;i++) {
		if(str.charAt(i-1)==" ") {
			let oldStr = str.substring(i-1,i+1)
			let newStr = oldStr.toUpperCase()
			str = str.replace(oldStr,newStr)
		}
	}
	return str
}

const removeVietnamese = str => VN.removeVietnamese(str)

module.exports = {
	standardize,
	standardizeName,
	removeVietnamese
}