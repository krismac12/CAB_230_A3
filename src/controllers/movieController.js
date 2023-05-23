const movieModel = require('../models/movieModel');
const principalModel = require('../models/principalModel');

// Controller methods
const getAllMovies = async (req, res) => {
    try {
        const { title, year, genre, page } = req.query;
        const moviesPerPage = 100;
        const currentPage = page || 1;
    
        // Construct the base query
        let query = movieModel.getAllMovies();

        // Calculate the starting index for the movies based on the page number
        const startIndex = (currentPage - 1) * moviesPerPage;

        // Add search conditions based on the provided parameters
        if (title) {
            query = query.where('primaryTitle', 'LIKE', `%${title}%`);
        }
    
        if (year) {
            query = query.where('year', year);
        }


        // Count the total number of movies
        const totalQuery = query.clone().clearSelect().clearOrder().count('* as count');
        const [{ count }] = await totalQuery;

        // Apply limit to the query
        query = query.offset(startIndex).limit(moviesPerPage);

        // Execute the query
        const movies = await query;

        // Add pagination data
        const pagination = {
            total: count,
            lastPage: Math.ceil(count / moviesPerPage),
            perPage: moviesPerPage,
            currentPage: currentPage,
            from: (currentPage - 1) * moviesPerPage + 1,
            to: (currentPage - 1) * moviesPerPage + movies.length,
        };
        
        
        // Send the movies as the response
        res.json({movies,pagination});
    } catch (error) {
        console.error('Error retrieving movies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getMovieById = async (req, res) => {
    try {
        const id = req.params.id; // Assuming the ID is passed as a route parameter
    
        // Fetch the movie by ID from the database
        const movie = await movieModel.getMovieById(id);
    
        // If the movie is found, fetch the principals by ID
        if (movie) {
            const principals = await principalModel.getPrincipalsbyID(id);
            movie.principals = principals;
    
            res.json(movie);
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        console.error('Error retrieving movie:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
  


// Export the controller methods
module.exports = {
    getAllMovies,
    getMovieById
};