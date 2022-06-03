const { default: axios } = require('axios')
const express = require('express')

const router = express.Router()

// Get /genre/ -- renders lists of genre.
router.get('/', (req, res) => {
    if(!res.locals.user) {
        // if the user is not authorized, ask them to log in
        res.render('users/login.ejs', {msg : 'please log in to continue'})
        return //end the router here
    }
    res.render('genre/main.ejs')
})
// listing 10 popular games categorized by its genre
router.get('/:id', (req, res) => {
    const Url = `https://www.freetogame.com/api/games?category=${req.params.id}&sort-by=popularity`
    axios.get(Url)
    .then(response => {
        res.render('genre/games.ejs',{
            games: response.data.slice(0,10),
            category: req.params.id})
    })
})




module.exports = router