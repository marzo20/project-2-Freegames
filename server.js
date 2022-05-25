// required packages
const express = require('express')
const rowdy = require('rowdy-logger')
const db = require('./models')
const cryptoJS = require('crypto-js')

// app config
const PORT = process.env.PORT || 3000
const app = express()
app.set('view engine', 'ejs')

// middlewares
const rowdyRes = rowdy.begin(app)
app.use(require('express-ejs-layouts'))
app.use(express.urlencoded({ extended: false }))
app.use(require('cookie-parser')())
// my first middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Incoming Request: ${req.method} ${req.url}`)
  next()
})

// auth middleware
app.use(async (req, res, next) => {
  
  // if there is a cookie, try to find that user in the db
  if (req.cookies.userId) {
    // decrypt the user id in the cookie
    const decryptedId = cryptoJS.AES.decrypt(req.cookies.userId, 'asdfasdf').toString(cryptoJS.enc.Utf8)
    // find the user in the db
    const user = await db.user.findByPk(decryptedId)
    // mount the user on the res.locals
    res.locals.user = user
  } else {
    // if there is no cookie -- no one is logged in
    res.locals.user = null
  }

  next()
})
// routes

// routes
app.get('/', (req, res) => {
  res.render('index')
})

// controllers
app.use('/users', require('./controllers/users.js'))

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  rowdyRes.print()
})
