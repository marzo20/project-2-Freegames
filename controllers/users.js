const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/new', (req, res) => {
  res.render('users/new.ejs')
})

router.post('/', async (req, res) => {
  try {
    // create a new user
    const newUser = await db.user.create(req.body)
    res.cookie('userId', newUser.id)
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
