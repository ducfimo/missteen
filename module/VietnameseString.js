const 	OBJ = {
	a : ['a','à','á','ả','ã','ạ','ă','ằ','ắ','ẳ','ẵ','ặ','â','ầ','ấ','ẩ','ẫ','ậ'],
	e : ['e','è','é','ẻ','ẽ','ẹ','ê','ề','ế','ể','ễ','ệ'],
	i : ['i','ì','í','ỉ','ĩ','ị'],
	o : ['o','ò','ó','ỏ','õ','ọ','ô','ồ','ố','ổ','ỗ','ộ','ơ','ờ','ớ','ở','ỡ','ợ'],
	u : ['u','ù','ú','ủ','ũ','ụ','ư','ừ','ứ','ử','ữ','ự'],
	y : ['y','ỳ','ý','ỷ','ỹ','ỵ'],
	d : ['d','đ'],

	A : ['A','À','Á','Ả','Ã','Ạ','Ă','Ằ','Ắ','Ẳ','Ẵ','Ặ','Â','Ầ','Ấ','Ẩ','Ẫ','Ậ'],
	E : ['E','È','É','Ẻ','Ẽ','Ẹ','Ê','Ề','Ế','Ễ','Ễ','Ệ'],
	O : ['O','Ò','Ó','Ỏ','Õ','Ọ','Ô','Ồ','Ố','Ổ','Ỗ','Ộ','Ơ','Ờ','Ớ','Ở','Ỡ','Ợ'],
	U : ['U','Ù','Ú','Ủ','Ũ','Ụ','Ư','Ừ','Ứ','Ử','Ữ','Ự'],
	D : ['D','Đ']
}

const removeVietnamese = str => {
	let result = str
	for(let key in OBJ)
		OBJ[key].forEach( element => {
			result = result.replace(new RegExp(element, 'g'), key)
		})
	return result
}

const toVietnamese = str => {
	if(str.length==0) return []
	if(str.length==1) {
		if(OBJ[str]) return OBJ[str]
		return [str]
	}
	let arr1 = toVietnamese(str.charAt(0))
	let arr2 = toVietnamese(str.substring(1))
	let result = []
	for(let s1 of arr1)
		for(let s2 of arr2)
			result.push(s1 + s2)
	return result
}

module.exports = {
	removeVietnamese,
	toVietnamese
}