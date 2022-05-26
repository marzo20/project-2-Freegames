const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const AES = require('crypto-js/aes')

// POST /users -- creates a new user in the db, sets a user cookie, redirects home
router.post('/', async (req, res) => {
  try {
    // hash password before putting it in the db
    const hashedPassword = bcrypt.hashSync(req.body.password, 12)
    // try to create user
    const [user, created] = await db.user.findOrCreate({ 
      where: { email: req.body.email }, 
      defaults: { password: hashedPassword }
    })

    // only let unique emails sign up
    if (created) {
      // ecrpyt user id before saving it as cookie
      const encryptedId = AES.encrypt(user.id.toString(), process.env.ENCRYPTION_KEY).toString()
      res.cookie('userId', encryptedId)
      res.redirect('/')
    } else {
      res.render('users/new.ejs', { msg: 'email already exists' })
    }
  } catch (err) {
    console.log(err)
  }
})

// GET /users/profile -- renders user profile
router.get('/profile', (req, res, next) => {
  if (!res.locals.user) {
    res.render('user/login.ejs', { msg: 'please login to continue' })
    return
  }
    
  res.render('users/profile.ejs', { user: res.locals.user }) 
})


// GET /users/new -- shows a sign up form
router.get('/new', (req, res) => {
  res.render('users/new.ejs', { msg: null })
})

// GET /users/login -- shows a login form to the user
router.get('/login', (req, res) => {
  res.render('users/login.ejs', { msg: null })
})

// POST /users/login -- recieves login form, authenticates user, redirects to root
router.post('/login', async  (req, res) => {
  try {  
    // lookup user using their email
    const foundUser = await db.user.findOne({ 
      where: {
        email: req.body.email
      }
    })
    const msg = 'bad login credentials'

    if (!foundUser) {
      console.log('email not found')
      res.render('users/login.ejs', { msg })
      return
    }

    //check if pass from db matches pass in req.body
    if (bcrypt.compareSync(req.body.password, foundUser.password)) {
      // if so -- log the user in and send a cookie -- redirect to homepage
      const encryptedId = AES.encrypt(foundUser.id.toString(), process.env.ENCRYPTION_KEY).toString()
      res.cookie('userId', encryptedId)
      res.redirect('/users/profile')
    } else {
      // if not redirect to login form
      console.log('pasword was incorrect')
      res.render('users/login.ejs', { msg })
    }
  } catch (err) {
    console.log(err)
  }
})

// POST /users/logout -- clears cookie and redirects to homepage
router.get('/logout', (req, res) => {
  res.clearCookie('userId')
  res.redirect('/')
})

module.exports = router
