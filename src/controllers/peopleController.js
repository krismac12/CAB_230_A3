const peopleModel = require('../models/peopleModel');
const principalModel = require('../models/principalModel');
const movieModel = require('../models/movieModel');



const getPersonById = async (req, res) => {
    try {
        const id = req.params.id;
    
        // Fetch the person by ID from the database
        const data = await peopleModel.getPersonById(id);

        const movieIDs = data.knownForTitles.split(",");
        const roles = [];

        await Promise.all(movieIDs.map(async (movieID) => {
            const principals = await principalModel.getPrincipalsByID(movieID);
            const matchingPrincipal = principals.find(principal => principal.nconst === id);
            if (matchingPrincipal) {
                const movie = await movieModel.getMovieById(movieID);
                const role = {
                    movieName: movie.primaryTitle,
                    movieId: movie.tconst,
                    category: matchingPrincipal.category,
                    characters: JSON.parse(matchingPrincipal.characters),
                    imdbRating: parseFloat(movie.imdbRating)
                };
                roles.push(role);
            }
          }));
        if (data) {
            person = {
                name:data.primaryName,
                birthYear:data.birthYear || null,
                deathYear:data.deathYear || null,
                roles: roles
            }
            res.json(person);
        } else {
            res.status(404).json({ error: 'Person not found' });
        }
    } catch (error) {
        console.error('Error retrieving Person:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getPersonById
};