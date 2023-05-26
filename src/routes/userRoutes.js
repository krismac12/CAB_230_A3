const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes for /user
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/:email/profile', userController.getUser);
router.put('/:email/profile', userController.putUser);
router.post('/refresh',userController.refreshBearerToken);
router.post('/logout',userController.logout)


module.exports = router;
