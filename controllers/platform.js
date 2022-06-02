const express = require('express')

const router = express.Router()

// Get /platform/ -- renders lists of platform.
router.get('/', (req, res) => {
    if(!res.locals.user) {
        // if the user is not authorized, ask them to log in
        res.render('users/login.ejs', {msg : 'please log in to continue'})
        return //end the router here
    }
    res.render('platform/main.ejs')
})
// GET /platform/pc --renders all the pc games
router.get('/pc', (req, res) => {
    res.render('platform/pc')
})

// GET /platform/browser -- renders all the browser platformed games
router.get('/browser', (req, res) => {
    res.render('platform/browser')
})



module.exports = router