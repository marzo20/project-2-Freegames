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
  res.locals.myData = 'Get a Free games today!'
  console.log(res.locals.myData)
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
    res.render('index', {games: response.data})
  })
})

// GET /saved --render a page for games saved for later
app.get('/saved', async (req, res) => {
  // get all faves from db
  const allSaved = await db.savedgame.findAll({
    where: {userId: res.locals.user.id}
  })
  // render faves page
  res.render('saved', {allSaved})
  console.log(allSaved)
})
// POST /saved -- adding a game to saved game list.
app.post('/saved', async (req, res) => {
  // create new saved games in db
  // redirect to show all fave -- dex not exist yet
 try {
  console.log(req.body.gameId,"GameId")
  const [save, savedCreated] = await db.savedgame.findOrCreate({
    where: {gameId: req.body.gameId,
        userId: res.locals.user.id},
        defaults: {
          title: req.body.title,
          thumbnail: req.body.thumbnail,
          game_url: req.body.game_url}
  })
  await db.category.findOrCreate({
    where: {gameId: req.body.gameId},
    defaults: {
      genre: req.body.genre,
      platform: req.body.platform
    }
  })
  await db.game.findOrCreate({
    where: {id: req.body.gameId},
    defaults: {title: req.body.title,
              gameUrl: req.body.game_url,
              description: req.body.short_description
    }
  })
  
  if(savedCreated) {
    res.redirect('/saved')
  } else {
    res.render('/saved', {msg: 'already saved to the list'}
    )
  }
  

 } catch (err) {
   console.log('erorrrrrrr',err)
 } 
})

// DELETE /saved/:id -- destroy db 
app.delete('/saved/:id', async (req, res) => {
  await db.savedgame.destroy(
    {where: {
      gameId: req.params.id
    }}
  )
  res.redirect('/saved')
})




// controllers
app.use('/users', require('./controllers/users.js'))
app.use('/genre', require('./controllers/genre.js'))
app.use('/platform', require('./controllers/platform.js'))
app.use('/search', require('./controllers/search.js'))
// 404 error handler -- NEEDS TO GO LAST
// app.get('/*', (req, res) => {
//   // render a 404 template
// })
app.use((error, req, res, next) => {
  // render a 404 template
  console.log(error)
  res.status(404).render('404.ejs')
})
// 500 error handler
//  needs to have all 4 params
app.use((error, req, res, next) => {
  console.log(error)
  // send a 500 error template
  res.status(500).render('500.ejs')
})
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  rowdyRes.print()
})
