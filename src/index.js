const express = require('express');
const app = express();
const mysql = require('mysql2');
const fs = require('fs');




const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'movies'
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }

  console.log('Connected to the database.');

  // Release the connection
  connection.release();

});
// Import the route file
const routes = require('./routes');    

// Mount the routes on the app
app.use('/movies', routes);


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
