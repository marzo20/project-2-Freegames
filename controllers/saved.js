const express = require('express')

const router = express.Router()

const db = require('../models')

// GET /saved --render a page for games saved for later
router.get('/', async (req, res) => {
    // get all faves from db
    const allSaved = await db.savedgame.findAll({
      where: {userId: res.locals.user.id}
    })
    console.log(allSaved)
    if(allSaved.length === 0){
  // render faves page
    res.render('saved', {allSaved,
    msg: "No games in the List"})
    // console.log(allSaved)
    }else{
  // render faves page
    res.render('saved', {allSaved,
    msg: ""})
    
    // console.log(allSaved)
    }
    
  })
  // POST /saved -- adding a game to saved game list.
  router.post('/', async (req, res) => {
    // create new saved games in db
    // redirect to show all fave -- dex not exist yet
   try {
    // console.log(req.body.gameId,"GameId")
    const [save, savedCreated] = await db.savedgame.findOrCreate({
      where: {gameId: req.body.gameId,
          userId: res.locals.user.id},
          defaults: {
            title: req.body.title,
            thumbnail: req.body.thumbnail,
            game_url: req.body.game_url}
    })
    await db.category.findOrCreate({
      where: {gameId: req.body.gameId},
      defaults: {
        genre: req.body.genre,
        platform: req.body.platform
      }
    })
    await db.game.findOrCreate({
      where: {id: req.body.gameId},
      defaults: {title: req.body.title,
                gameUrl: req.body.game_url,
                description: req.body.short_description
      }
    })
    
    if(savedCreated) {
      const allSaved = await db.savedgame.findAll({
        where: {userId: res.locals.user.id}
      })
      res.render('saved', {msg: "Selected game saved in the list!",
    allSaved})
    } else {
      const allSaved = await db.savedgame.findAll({
        where: {userId: res.locals.user.id}
      })
      res.render('saved', {msg: 'Selected game is already in the list!',
    allSaved}
      )
    }
    
  
   } catch (err) {
     console.log('erorrrrrrr',err)
   } 
  })
  
  // DELETE /saved/:id -- destroy db 
  router.delete('/:id', async (req, res) => {
    await db.savedgame.destroy(
      {where: {
        gameId: req.params.id
      }}
    )
    res.redirect('/saved')
  })

module.exports = router