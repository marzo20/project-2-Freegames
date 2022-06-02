const { default: axios } = require('axios')
const express = require('express')

const router = express.Router()

// Get search page and search form
router.get('/', (req, res) => {
    if(!res.locals.user) {
      // if the user is not authorized, ask them to log in
      res.render('users/login.ejs', {msg : 'please log in to continue'})
      return //end the router here
    }
    res.render('search/search')
  })
router.get('/results', (req, res) => {
    
    const Url = `https://www.freetogame.com/api/games?${req.query.searchBy}=${req.query.input}`
    axios.get(Url)
    .then(response => {
      // console.log(Url)
      // console.log(req.query)
      res.render('search/results', {results: response.data})
      
      // console.log(req.query.searchBy, req.query.input)
    })
  })


module.exports = router