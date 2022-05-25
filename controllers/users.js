const express = require('express')
const router = express.Router()
const db = require('../models')

// POST /users -- creates a new user in the db, sets a user cookie, redirects home
router.post('/', async (req, res) => {
  try {
    // create a new user
    const [user, created] = await db.user.findOrCreate({ 
      where: { email: req.body.email }, 
      defaults: { password: req.body.password }
    })

    // only let unique emails sign up
    if (created) {
      res.cookie('userId', newUser.id)
      res.redirect('/')
    } else {
      res.render('users/new.ejs', { msg: 'email already exists' })
    }
  } catch (err) {
    console.log(err)
  }
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

    //check if email from form matches email in db
    if (foundUser.email === req.body.email) {
      // if so -- log the user in and send a cookie -- redirect to homepage
      res.cookie('userId', foundUser.id)
      res.redirect('/')
    } else {
      // if not redirect to login form
      res.render('users/login.ejs', { msg })
    }
  } catch (err) {
    console.log(err)
  }
})

// POST /users/logout -- clears cookie and redirects to homepage
router.post('/logout', (req, res) => {
  res.clearCookie('userId')
  res.redirect('/')
})

module.exports = router
