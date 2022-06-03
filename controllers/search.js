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
  // console.log("request is", req.query)
  try{
    const Url = `https://www.freetogame.com/api/games?${req.query.searchBy}=${req.query.input}`
    axios.get(Url)
    .then(response => {
      // res.send("response from",Url)
      if(!response.data) {
        res.render('search/noresult', {msg: "result not found, try another keyword"})
      } else {
        res.render('search/results', {results: response.data,
                                      msg: ""})
      }
      
      
      // console.log(req.query.searchBy, req.query.input)
    }) 
  } catch (error){
      res.send('error catched from search result', error )
    }
  })


module.exports = router