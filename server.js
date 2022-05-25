// required packages
const express = require('express')
const rowdy = require('rowdy-logger')

// app config
const PORT = process.env.PORT || 3000
const app = express()
app.set('view engine', 'ejs')

// middlewares
const rowdyRes = rowdy.begin(app)
app.use(require('express-ejs-layouts'))
app.use(express.urlencoded({ extended: false }))

// my first middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Incoming Request: ${req.method} ${req.url}`)
  next()
})

// auth middleware
app.use(async (req, res, next) => {
  if (req.cookies.userId) {
    const userId = req.cookies.userId
    const user = await models.user.findByPk(userId)
    res.locals.user = user
  } else {
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
