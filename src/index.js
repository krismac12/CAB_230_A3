const express = require('express');
const app = express();
const mysql = require('mysql2');
const fs = require('fs');

// Import the route file
const movieRoutes = require('./routes/movieRoutes');    

// Mount the routes on the app
app.use('/movies', movieRoutes);


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
