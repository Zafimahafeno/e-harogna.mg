require('dotenv').config()
import express from 'express'
import cors from 'cors'
import { routes } from './routes'
import { createConnection } from 'typeorm'
import cookieParser from 'cookie-parser'
import sessions from 'express-session'
import bodyParser from 'body-parser'
import flash from 'connect-flash'
var fs = require('fs')
var http = require('http')
var https = require('https')
var privateKey = fs.readFileSync('key.pem', 'utf8')
var certificate = fs.readFileSync('cert.pem', 'utf8')
var credentials = { key: privateKey, cert: certificate }

createConnection()
	.then(connection => {
		const app = express()
		const oneDay: number = 1000 * 60 * 60 * 24

		app.use(cookieParser())
		app.use(bodyParser.urlencoded({ extended: false }))
		app.use(bodyParser.json())
		app.use(
			sessions({
				secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767bestoftheworld',
				saveUninitialized: true,
				cookie: { maxAge: oneDay },
				resave: false,
			})
		)
		app.use(express.json())
		app.use(express.static('assets'))
		app.use(flash())
		app.set('view engine', 'ejs')
		app.use(
			cors({
				credentials: true,
				origin: ['http://localhost:3000'],
			})
		)

		app.use((req, res, next) => {
			res.locals.message = req.flash()
			res.locals.user = req.session['uId']
			console.log(res.locals)

			next()
		})

		routes(app)

		app.use((req, res, next) => {
			res.status(404).render('404', { title: '404: Page Note Found', errors: 'Page Not found' })
		})

		app.use(function (error, req, res, next) {
			res.status(500).render('500', { title: '500: Internal Server Error', error: error })
		})

		// var httpsServer = https.createServer(credentials, app)
		// httpsServer.listen(443)

		app.listen(8000, () => {
			console.log('listening in port 8000')
		})
	})
	.catch(err => {
		console.log(err)
	})
