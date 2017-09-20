const rp = require('request-promise')

const jsdom = require('jsdom')
const {JSDOM } = jsdom

const STR = require('./module_string')

const URL_BEGIN = "http://missteen.vn/thisinh-"
const SBD_MIN = 1001  // 14
const SBD_MAX = 2100  // 2063

const MDB = require('./module_mongodb')
const DATABASE = 'missteen'
const COLLECTION = 'thisinh'

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
	return rp(`${URL_BEGIN}${sbd}`).then( (body) => {
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
