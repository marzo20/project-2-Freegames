const express = require('express')

const router = express.Router()

// Get /genre/ -- renders lists of genre.
router.get('/', (req, res) => {
    res.render('platform/main.ejs')
})




module.exports = router