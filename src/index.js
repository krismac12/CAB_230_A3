const express = require('express');
const app = express();
const mysql = require('mysql2');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // or swagger.yaml




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
// Import the route files
const movieRoutes = require('./routes/movieRoutes');
const peopleRoutes = require('./routes/peopleRoutes');    
const userRoutes = require('./routes/userRoutes');    


// Middleware to parse JSON request body
app.use(express.json());

// Mount the routes on the app
app.use('/movies', movieRoutes);
app.use('/people', peopleRoutes);
app.use('/user',userRoutes);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
