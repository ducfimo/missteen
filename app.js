const express = require("express")
const app= express()
const PORT = 3000

const body_parser = require('body-parser')
app.use(body_parser.json())

const MDB = require('./module/mongodb')
const DATABASE = 'missteen'
const COLLECTION = 'thisinh'

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
	let Ten = req.params.Ten
	let cond = makeOrCondition({Ten})
	if(cond.$or.length==0) res.send({error:false, data:[]})
	else MDB.find(DATABASE, COLLECTION, cond).then( (results) => {
		res.send({error:false, data:results})
	}).catch( (e) => {
		res.send({error:true})
		console.log(e)
	})
})

app.post('/search', (req, res) => {
	let cond = makeOrCondition(req.body)
	if(cond.$or.length==0) res.send({error:false, data:[]})
	else MDB.find(DATABASE, COLLECTION, cond).then( (results) => {
		res.send({error:false, data:results})
	}).catch( (e) => {
		res.send({error:true})
		console.log(e)
	})
})

function makeOrCondition(body) {
	let $or = []
	if(body.SBD) {
		let SBD = Number(body.SBD)
		$or.push({SBD})
	}
	if(body.Ten) {
		let temp = body.Ten
		temp = temp.match(/(\S)+/g)
		if(temp) {
			let arr = []
			temp.forEach( v => {
				if(v.charAt(0).toUpperCase()==v.charAt(0)) {
					let or = []
					or.push({Ten: new RegExp(`^${v} | ${v} | ${v}$`)})
					or.push({TenKhongDau: new RegExp(`^${v} | ${v} | ${v}$`)})
					arr.push({$or: or})
				}
			})
			if(arr.length) $or.push({$and: arr})
		}
	}
	return {$or}
}