require('dotenv').config()

const express = require('express')
const rowdy = require('rowdy-logger')
const cookieParser= require('cookie-parser')
const axios = require('axios')
const db = require('./models')
const cryptoJS = require('crypto-js')
const methodOverride = require('method-override')

// app config
const PORT = process.env.PORT || 3000
const app = express()
app.set('view engine', 'ejs')

// middlewares
const rowdyRes = rowdy.begin(app)
app.use(require('express-ejs-layouts'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(methodOverride('_method'))

// DIY middleward
// happenes on every request
app.use((req, res, next) => {
  // console.log(`[${new Date().toLocaleString()}] incoming request: ${req.method} ${req.url}`)
  // console.log('request body:',req.body)
  // modify the response to give data to the routes/middleware that is 'downstream'
  // res.locals.myData = 'Get a Free games today!'
  // console.log(res.locals.myData)
  // tell express that the middleware is doen
  next()
})
//  auth middleware
app.use( async (req, res, next) => {
  try {
// if there is a cookie, try to find that user in the db
if (req.cookies.loginId) {
  // try to find that user in the db
  const loginId = req.cookies.loginId
  const decryptedId = cryptoJS.AES.decrypt(loginId, process.env.ENC_KEY).toString(cryptoJS.enc.Utf8)
  const user = await db.user.findByPk(decryptedId)
  // mount the found user on the res.locals so that later routes can access the logged in user

  res.locals.user = user
} else {
  // the user is explicitly not logged in
  res.locals.user = null
}
next()

  } catch (err){
    console.log('errrrr')
  } 
    
    // mount the found user on the res.locals so that later routes can access the logged in user

})
// routes
app.get('/', (req, res) => {
  // throw new Error('ooooooppssss')
  const Url = 'https://www.freetogame.com/api/games'
  axios.get(Url)
  .then(response => {
    if(!res.locals.user) {
      console.log('Login Needed')
      res.render('index', {msg: 'Login to Download more Free Games',
                          games: response.data})
    }else {
      res.render('index', {msg: 'Download free games!',
                          games: response.data})
    }
  })
  
})






// controllers
app.use('/users', require('./controllers/users.js'))
app.use('/genre', require('./controllers/genre.js'))
app.use('/platform', require('./controllers/platform.js'))
app.use('/search', require('./controllers/search.js'))
app.use('/saved', require('./controllers/saved.js'))
// 404 error handler -- NEEDS TO GO LAST
app.get('/*', (req, res, next) => {
  // render a 404 template
  const error = new Error("not found")
  error.status = 404
  next(error)
})
app.use((error, req, res, next) => {
  // render a 404 template
  console.log('404 error is happening',error)
  res.status(404).render('404.ejs')
})
// 500 error handler
//  needs to have all 4 params
app.use((error, req, res, next) => {
  console.log('500 error!!!!', error)
  // send a 500 error template
  res.status(500).render('500.ejs')
})
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  rowdyRes.print()
})
