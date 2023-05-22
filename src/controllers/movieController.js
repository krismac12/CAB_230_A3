// Controller methods
const getAllMovies = async (req, res) => {
    try {
        // Fetch all movies from the database
        const movies = "movies";
    
        // Send the movies as the response
        res.json(movies);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getMovieById = async (req, res) => {
    try {
        // Fetch all movies from the database
        const movies = "movies";
    
        // Send the movies as the response
        res.json(movies);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'Internal server error' });
    }
};


  // Export the controller methods
module.exports = {
        getAllMovies,
        getMovieById
};