#! /usr/bin/env node 

const { Command } = require('commander')
const program = new Command()

program
	.name('lit')
	.version('1.0.0')
	
program
	.argument('<filename>')
	.requiredOption('-p,--port <number>', 'port number')
	.action(handlerAction)
	.parse()

// function
const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
app.use(express.json())

function handlerAction(argv, options) {
	try {
		let data = fs.readFileSync(argv, 'utf-8')
		try {
			let obj = JSON.parse(data)
			startService(obj, argv, options.port)
		} catch(e) {
			console.log('invalid json')
		}
	} catch(e) {
		console.log('file not found')
	}
}

function startService(obj,filename,port) {
	// router user 
	Object.keys(obj).forEach(e => {
		// main route
		app.get(`/${e}`, (req,res) => {
			return res.send(obj[e])
		})
		// get by id 
		app.get(`/${e}/:id`, (req,res) => {
			let index = obj[e].findIndex(u => u.id === req.params.id)
			return res.send(obj[e][index])
		})
		// delete by id 
		app.delete(`/${e}/:id`, (req,res) => {
			let index = obj[e].findIndex(u => u.id === req.params.id)
			delete obj[e][index]
			obj[e].filter(u => u !== null)
			try {
				fs.writeFileSync(filename, JSON.stringify(obj))
				return true
			} catch(e) {
				return console.log(e)
			}
		})
		// post data
		app.post(`/${e}`, (req,res) => {
			if(!obj[e].id) {
				obj[e].id = obj[e].length + 1
			}
			obj[e].push(req.body)
			try {
				fs.writeFileSync(filename, JSON.stringify(obj))
				return true
			} catch(e) {
				return console.log(e)
			}
		})
	})
	// index
	app.get('/', (req,res) => {
		return res.sendFile(path.join(__dirname,'../index.html'))
	})
	// error handler
	app.use((err,req,res,next) => {
		if(err) return console.log(err)
		return next()
	})
	// endpoint not found
	app.use((req,res) => {
		return res.send('No Endpoint')
	})
}