const express = require("express")
const app= express()
const PORT = 3000

const rp = require('request-promise')

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const DB_URL = 'mongodb://localhost:27017/missteen'
const COLLECTION = 'thisinh'

const jsdom = require('jsdom')
const {JSDOM } = jsdom

const URL = "http://missteen.vn/thisinh-"
const SBD_MIN = 1  // 14
const SBD_MAX = 0  // 2063

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}!`)
})

app.get('/sbd/:SBD', (req, res) => {
	let SBD = Number(req.params.SBD)
	find({SBD}).then( (results) => {
		res.send({error:false, data:results})
	}).catch( (e) => {
		res.send({error:true})
		console.log(e)
	})
})

app.get('/ten/:Ten', (req, res) => {
	let temp = req.params.Ten
	temp = standardize(temp)
	temp = temp.split(" ")
	let arr = []
	for(let i=0;i<temp.length;i++) {
		if(temp[i].charAt(0).toUpperCase()==temp[i].charAt(0)) {
			let or = []
			or.push({"Ten": new RegExp(`^${temp[i]} `)}) // Ho 
			or.push({"Ten": new RegExp(` ${temp[i]} `)}) // Dem
			or.push({"Ten": new RegExp(` ${temp[i]}$`)}) // Ten
			// khong dau
			or.push({"TenKhongDau": new RegExp(`^${temp[i]} `)}) // Ho 
			or.push({"TenKhongDau": new RegExp(` ${temp[i]} `)}) // Dem
			or.push({"TenKhongDau": new RegExp(` ${temp[i]}$`)}) // Ten
			arr.push({$or: or})
		}
	}
	if(arr.length==0) res.send({error:false, data:[]})
	else find({$and : arr}).then( (results) => {
		res.send({error:false, data:results})
	}).catch( (e) => {
		res.send({error:true})
		console.log(e)
	})
})

// get data from web and insert to mongodb
/*let j = 0
for(let i=SBD_MIN;i<=SBD_MAX;i++) {
	getInformation(i).then( (results) => {
		if(results==0) return 0
		else return insert(results)
	}).then( (v) => {
		j++
		if(j%50==0) console.log(j)
		if(j==SBD_MAX-SBD_MIN+1) console.log("end")
	}).catch( (e) => {
		console.log(`i = ${i}`, e)
	})
}*/

function getInformation(sbd) {
	return rp(`${URL}${sbd}`).then( (body) => {
		let dom = (new JSDOM(body)).window.document
		let div = dom.getElementsByClassName('nd mCustomScrollbar')[0]
		if(!div) return 0
		let temp = div.innerHTML.split("</b>")
		let imgs = dom.getElementsByClassName('slider')[0].getElementsByTagName("img")
	
		let SBD = sbd
		let Ten = standardizeName(dom.getElementsByTagName('title')[0].innerHTML)
		let TenKhongDau = standardizeNameNoVietnamese(Ten)
		let Tinh_ThanhPho = standardizeName(div.getElementsByTagName('span')[0].innerHTML)
		let ChieuCao = standardize(temp[2].substring(0, temp[2].indexOf('<')))
		//ChieuCao = ChieuCao.replace("cm","")
		//ChieuCao = ChieuCao.replace("m","")
		//ChieuCao = Number(ChieuCao)
		//if(isNaN(ChieuCao)) console.log(i, ChieuCao)
		let NangKhieu = standardize(temp[4].substring(0, temp[4].indexOf('<')))
		let SoThich = standardize(temp[5].substring(0, temp[5].indexOf('<')))
		let SoLuongTimVote = Number(dom.getElementsByClassName("text")[0].innerHTML)
		let DuongDanAnh = []
		for(let i=1;i<imgs.length;i+=2) {
			DuongDanAnh.push(imgs[i].src)
		}

		let results = {SBD,Ten,TenKhongDau,Tinh_ThanhPho,ChieuCao,NangKhieu,SoThich,DuongDanAnh,SoLuongTimVote}
		return results
	})
}

function insert(data) {
	return MongoClient.connect(DB_URL).then( (db) => {
		let collection = db.collection(COLLECTION)
		return collection.insert(data).then( (results) => {
			db.close()
			return results
		})
	})
}

function find(conditions) {
	return MongoClient.connect(DB_URL).then( (db) => {
		let collection = db.collection(COLLECTION)
		return collection.find(conditions, {_id:0}).toArray().then( (results) => {
			db.close()
			return results
		})
	})
}

let standardize = (string) => {
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

let standardizeName = (name) => {
	let str = standardize(name).toLowerCase()
	str = str.replace('('," ( ")
	str = str.replace('-'," - ")
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

let standardizeNameNoVietnamese = (name) => {
	let str = name.toLowerCase()
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i")
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
	str = str.replace(/đ/g, "d")
	str = standardizeName(str)
	return str;
}
