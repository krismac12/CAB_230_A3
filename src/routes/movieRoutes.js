const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// Routes for /movies
router.get('/search', movieController.getAllMovies);
router.get('/data/:id', movieController.getMovieById);


module.exports = router;
