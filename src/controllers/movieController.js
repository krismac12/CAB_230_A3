const movieModel = require('../models/movieModel');
const principalModel = require('../models/principalModel');

// Controller methods
const getAllMovies = async (req, res) => {
    try {
        const { title, year, page } = req.query;
        const moviesPerPage = 100;
        const currentPage = page || 1;

        // Validate query parameters
        if (title && typeof title !== 'string') {
            return res.status(400).json({
                error: true,
                message: 'Invalid query parameter: title',
            });
        }

        if (year && (!/^\d{4}$/.test(year) || typeof year !== 'string')) {
            return res.status(400).json({
                error: true,
                message: 'Invalid query parameter: year. Year must be a four-digit number (e.g., 1999).',
            });
        }

        if (page && (!Number.isInteger(Number(page)) || typeof page !== 'string')) {
            return res.status(400).json({
                error: true,
                message: 'Invalid query parameter: page. Page must be a number.',
            });
        }

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

        // Format the movies data
        const data = movies.map((movie) => ({
            title: movie.primaryTitle,
            year: movie.year,
            imdbID: movie.tconst,
            imdbRating: parseFloat(movie.imdbRating),
            rottenTomatoesRating: parseInt(movie.rottentomatoesRating),
            metacriticRating: parseInt(movie.metacriticRating),
            classification: movie.rated,
        }));

        // Add pagination data
        const pagination = {
            total: count,
            lastPage: Math.ceil(count / moviesPerPage),
            perPage: moviesPerPage,
            currentPage: currentPage,
            from: (currentPage - 1) * moviesPerPage + 1,
            to: (currentPage - 1) * moviesPerPage + movies.length,
        };

        // Send the movies and pagination data as the response
        res.json({ data, pagination });
    } catch (error) {
        console.error('Error retrieving movies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getMovieById = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Check if there are any query parameters
        if (Object.keys(req.query).length > 0) {
            return res.status(400).json({
                error: true,
                message: 'Invalid query parameters',
            });
        }
        
        // Fetch the movie by ID from the database
        const data = await movieModel.getMovieById(id);

        if (data) {
            const movie = {
                title: data.primaryTitle,
                year: data.year,
                runtime: data.runtimeMinutes,
                genres: data.genres.split(',').map((genre) => genre.trim()),
                country: data.country,
            };

            // If the movie is found, fetch the principals by ID
            const principals = await principalModel.getPrincipalsByID(id);

            // Iterate through each principal
            if (Array.isArray(principals) && principals.length > 0) {
                movie.principals = principals.map((principal) => ({
                    id: principal.nconst,
                    category: principal.category,
                    name: principal.name,
                    characters: principal.characters ? JSON.parse(principal.characters) : [],
                }));
            } else {
                movie.principals = [];
            }

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