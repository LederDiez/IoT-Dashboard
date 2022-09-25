// Imports
const express = require('express')
const morgan = require('morgan')
const colors = require('colors')
const path = require('path')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// Config imports
const configs = require('./config/configs.js')

// Models and services imports
const session = require('./services/mongoose')
const UserModel = require('./models/UserModel')

// Routes imports
const appRoutes = require('./routes/appRoutes')
const v1Routes = require('./routes/v1Routes')

const app = express()
colors.enable()

// settings
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))
app.set('port', configs.PORT)

// middlewares
app.use(morgan('dev'))
app.use(cookieParser(configs.COOKIE_SECRET))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session)
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(UserModel.authenticate()))
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

// static files
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.static(path.join(__dirname, '../views')))

// Route https
app.use(function (req, res, next) {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && configs.NODE_ENV !== 'development') {
    return res.redirect('https://' + req.get('Host') + req.url)
  }
  next()
})

// routers
app.use('/', v1Routes)
app.use('/', appRoutes)

// Route not found (404)
app.use(function (_req, res, _next) {
  return res.status(404).sendFile(path.join(__dirname, '../views/404.html'))
})

// Any error
const errorHandler = (err, _req, res, _next) => {
  console.log(err)
  return res.status(500).sendFile(path.join(__dirname, '../views/500.html'))
}
app.use(errorHandler)

app.listen(app.get('port'), () => {
  console.log('WEB SERVER STARTED!!!'.red)
  console.log('WEB SOCKET STARTED!!!'.red)
})
