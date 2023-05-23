const express = require('express');
const router = express.Router();
const movieController = require('./controllers/movieController');

// Routes for /movies
router.get('/search', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);


module.exports = router;
