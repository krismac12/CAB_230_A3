const peopleModel = require('../models/peopleModel');
const principalModel = require('../models/principalModel');
const movieModel = require('../models/movieModel');
const { jwtSecret} = require('../config');
const jwt = require('jsonwebtoken');





const getPersonById = async (req, res) => {
    try {
        const id = req.params.id;

        // Fetch the person by ID from the database
        const data = await peopleModel.getPersonById(id);

        if (!data) {
            return res.status(404).json({ error: 'Person not found' });
        }
        const authorizedHeader = req.headers.authorization;
        const [bearerKeyword, bearerToken] = authorizedHeader.split(' ');
		try {
			const decodedToken = jwt.verify(bearerToken, jwtSecret);
            console.log(decodedToken)
            // Check if the token has expired
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
                return res.status(401).json({ error: true, message: 'JWT token has expired' });
            }
        } catch (error) {
			// Handle token verification errors
            console.log(error)
            return res.status(401).json({
                error: true,
                message: "Invalid JWT token"
			});
		}

        const movieIDs = data.knownForTitles.split(",");
        const roles = [];

        await Promise.all(movieIDs.map(async (movieID) => {
            const principals = await principalModel.getPrincipalsByID(movieID);
            const matchingPrincipal = principals.find(principal => principal.nconst === id);
            if (matchingPrincipal) {
                const movie = await movieModel.getMovieById(movieID);
                let characters;
                try {
                    characters = JSON.parse(matchingPrincipal.characters);
                } catch (error) {
                    console.error('Error parsing characters:', error);
                    characters = [];
                }
                const role = {
                    movieName: movie.primaryTitle,
                    movieId: movie.tconst,
                    category: matchingPrincipal.category,
                    characters: characters,
                    imdbRating: parseFloat(movie.imdbRating)
                };
                roles.push(role);
            }
        }));

        const person = {
            name: data.primaryName,
            birthYear: data.birthYear || null,
            deathYear: data.deathYear || null,
            roles: roles
        };

        res.json(person);
    } catch (error) {
        console.error('Error retrieving Person:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getPersonById
};


module.exports = {
    getPersonById
};


module.exports = {
    getPersonById
};