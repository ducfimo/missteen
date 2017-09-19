const express = require("express")
const app= express()
const PORT = 3000

const body_parser = require('body-parser')
app.use(body_parser.json())

const STR = require('./module_string')

const MDB = require('./module_mongodb')
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
	let array = []

	let SBD = Number(req.body.SBD)
	array.push({SBD})

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
		if(arr.length) array.push({$and: arr})
	}

	MDB.find(DATABASE, COLLECTION, {$or : array}).then( (results) => {
		res.send({error:false, data:results})
	}).catch( (e) => {
		res.send({error:true})
		console.log(e)
	})
})
