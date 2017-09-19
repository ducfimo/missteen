const express = require("express")
const app= express()
const PORT = 3000

const body_parser = require('body-parser')
app.use(body_parser.json())

const rp = require('request-promise')

const STR = require('./module_string')

const MDB = require('./module_mongodb')
const DATABASE = 'missteen'
const COLLECTION = 'thisinh'

const jsdom = require('jsdom')
const {JSDOM } = jsdom

const URL = "http://missteen.vn/thisinh-"
const SBD_MIN = 1401  // 14
const SBD_MAX = 0  // 2063

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}!`)
})

app.get('/sbd/:SBD', (req, res) => {
	let SBD = Number(req.params.SBD)
	MDB.find(DATABASE, COLLECTION, {SBD}).then( (results) => {
		res.send({error:false, data:results})
	}).catch( (e) => {
		res.send({error:true})
		console.log(e)
	})
})

app.get('/ten/:Ten', (req, res) => {
	let temp = req.params.Ten
	temp = STR.standardize(temp)
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
	else MDB.find(DATABASE, COLLECTION, {$and : arr}).then( (results) => {
		res.send({error:false, data:results})
	}).catch( (e) => {
		res.send({error:true})
		console.log(e)
	})
})

app.post('/search', (req, res) => {
	let conditions = {$or : []}

	let SBD = Number(req.body.SBD)
	conditions.$or.push({SBD})

	let temp = req.body.Ten
	if(temp) {
		temp = STR.standardize(temp)
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
		if(arr.length) conditions.$or.push({$and: arr})
	}

	MDB.find(DATABASE, COLLECTION, conditions).then( (results) => {
		res.send({error:false, data:results})
	}).catch( (e) => {
		res.send({error:true})
		console.log(e)
	})
})

// get data from web and insert to mongodb
let j = 0
for(let i=SBD_MIN;i<=SBD_MAX;i++) {
	getInformation(i).then( (results) => {
		if(results==0) return 0
		else return MDB.insertMany(DATABASE, COLLECTION, [results])
	}).then( (v) => {
		j++
		if(j%50==0) console.log(j)
		if(j==SBD_MAX-SBD_MIN+1) console.log("end")
	}).catch( (e) => {
		console.log(`i = ${i}`, e)
	})
}

function getInformation(sbd) {
	return rp(`${URL}${sbd}`).then( (body) => {
		let dom = (new JSDOM(body)).window.document
		let div = dom.getElementsByClassName('nd mCustomScrollbar')[0]
		if(!div) return 0
		let temp = div.innerHTML.split("</b>")
		let imgs = dom.getElementsByClassName('slider')[0].getElementsByTagName("img")
	
		let SBD = sbd
		let Ten = STR.standardizeName(dom.getElementsByTagName('title')[0].innerHTML)
		let TenKhongDau = STR.removeVietnamese(Ten)
		let Tinh_ThanhPho = STR.standardizeName(div.getElementsByTagName('span')[0].innerHTML)
		let ChieuCao = STR.standardize(temp[2].substring(0, temp[2].indexOf('<')))
		let NangKhieu = STR.standardize(temp[4].substring(0, temp[4].indexOf('<')))
		let SoThich = STR.standardize(temp[5].substring(0, temp[5].indexOf('<')))
		let SoLuongTimVote = Number(dom.getElementsByClassName("text")[0].innerHTML)
		let DuongDanAnh = []
		for(let j=1;j<imgs.length;j+=2) {
			DuongDanAnh.push(imgs[j].src)
		}

		let results = {SBD,Ten,TenKhongDau,Tinh_ThanhPho,ChieuCao,NangKhieu,SoThich,DuongDanAnh,SoLuongTimVote}
		return results
	})
}
