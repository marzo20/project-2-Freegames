const express = require('express')

const router = express.Router()

// Get /genre/ -- renders lists of genre.
router.get('/', (req, res) => {
    if(!res.locals.user) {
        // if the user is not authorized, ask them to log in
        res.render('users/login.ejs', {msg : 'please log in to continue'})
        return //end the router here
    }
    res.render('platform/main.ejs')
})




module.exports = router