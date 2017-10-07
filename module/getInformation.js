const rp = require('request-promise')
const URL_BEGIN = "http://missteen.vn/thisinh-"

const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM

const STR = require('./string')

function getHTML(sbd) {
	return rp(URL_BEGIN + sbd)
}

function readHTML(body) {
	let dom = (new JSDOM(body)).window.document
	let div = dom.getElementsByClassName('nd mCustomScrollbar')[0]
	if(!div) return 0
	let div1 = dom.getElementsByClassName('sbd')[0]
	let temp = div.innerHTML.split("</b>")
	let imgs = dom.getElementsByClassName('slider')[0].getElementsByTagName("img")
	
	let SBD = Number(div1.innerHTML.match(/[0-9]+/g)[0])
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
	let result = {SBD,Ten,TenKhongDau,Tinh_ThanhPho,ChieuCao,NangKhieu,SoThich,DuongDanAnh,SoLuongTimVote}
	return result
}

module.exports = {
	getHTML,
	readHTML
}