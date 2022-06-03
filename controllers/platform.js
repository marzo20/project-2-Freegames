const { default: axios } = require('axios')
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
// GET /platform/:id --renders all the game sort by platforms
router.get('/:id', (req, res) => {
    const Url = `https://www.freetogame.com/api/games?platform=${req.params.id}`
    axios.get(Url)
    .then(response => {
        // console.log(response.data)
        res.render('platform/pc', {games: response.data})
    })
    
})





module.exports = router