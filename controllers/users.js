const express = require('express')

const router = express.Router()

const db = require('../models')
const cryptoJS = require('crypto-js')
const bcrypt = require('bcryptjs')


// Get /users/new -- renders a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs', {msg: null})
})

// POST /users -- creates a new user and redirects to index
router.post('/', async (req, res, next) => {
    try {
        // try to create th user
        const hashedPassword = bcrypt.hashSync(req.body.password, 12)
        const [user, created] = await db.user.findOrCreate({
            where: {loginId: req.body.loginId},
            defaults: {password: hashedPassword,
                       nickname: req.body.nickname}
        })
        // throw new Error('server melted down')
        // if the user is new
        if(created) {
            // login them in by giving them cookie
            // res.cookie('cookie name', cookie data)
            // TODO: encrypt id
            const encryptedId = cryptoJS.AES.encrypt(user.id.toString(), process.env.ENC_KEY).toString()
            res.cookie('loginId',encryptedId)
            // redirect to the homepage (in the future this could redirect elsewhere)
            res.redirect('users/profile')
        } else {
            // if the user was not created
            // re render the login form with a message for the user
            console.log('that ID already exists')
            res.render('users/new.ejs', {msg: 'ID exists in database already'})
        }
    } catch (err) {
        next(err)
    }
    
})

//  Get /users/login -- renders a login form
router.get('/login', (req, res) => {
    res.render('users/login.ejs', {msg:null})
})

// POST /userslogin -- authenticates user credentials against the database

router.post('/login', async (req, res, next) => {
    try {
        // look up the user in the db based on their email
        const foundUser = await db.user.findOne({
            where: {loginId: req.body.loginId}
        })
        const msg = 'bad login credentials, you are not authenticated'
        // if the user is not found -- display the login form and
        if(!foundUser) {
            console.log('ID not found on login')
            res.render('users/login.ejs', {msg})
            return // do not continue with the function
        } 
        // give them a message
        // otherwise, check the provided password against the password in the database
        // hash the password from the req.body and compare it to the db password
        const compare = bcrypt.compareSync(req.body.password, foundUser.password)
            if(compare) {
                // if they match -- send the user a cookie! to log them in
                const encryptedId = cryptoJS.AES.encrypt(foundUser.id.toString(), process.env.ENC_KEY).toString()
            res.cookie('loginId',encryptedId)
                // TODO: redirect to profile
                res.redirect('/', )
            }else {
                // if not --render the login form with a message
                res.render('users/login.ejs', {msg})
            }
            
    } catch (err) {
        next(err)
    }
})
// GET /users/logout -- clear the cookie to log the user out
router.get('/logout', (req, res ) => {
    // clear the cookie from storage
    res.clearCookie('loginId')
    // redirect to root
    res.redirect('/')
})
// GET/profile render user profile page
router.get('/profile', (req, res) => {
    // check if user is authorized
    if(!res.locals.user) {
        // if the user is not authorized, ask them to log in
        res.render('users/login.ejs', {msg : 'please log in to continue'})
        return //end the router here
    } else {
        res.render('users/profile.ejs', {user: res.locals.user})
    }
})

// GET /profile/edit rendering profile edit page
router.get('/profile/edit', (req, res) => {
    res.render('users/edit.ejs')
})

// PUT /profile  update new nickname for user profile
router.put('/profile', async (req, res) => {
    try{
        const newNick = req.body.nickname 
        const user = await db.user.findOne({
            where: {
                id: res.locals.user.id
            }
        })
        user.nickname = newNick
        await user.save()
        console.log(user)
        res.redirect('/users/profile')
    }catch (err) {
        console.log(err)
    }
   
    
})

module.exports = router