const express = require('express');
const router = express.Router();
const peopleController = require('../controllers/peopleController');

// Routes for /people
router.get('/:id', peopleController.getPersonById);


module.exports = router;
