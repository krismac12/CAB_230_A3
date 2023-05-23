const peopleModel = require('../models/peopleModel');

const getPersonById = async (req, res) => {
    try {
        const id = req.params.id;
    
        // Fetch the person by ID from the database
        const data = await peopleModel.getPersonById(id);
    
        if (data) {
            person = {
                name:data.primaryName,
                birthYear:data.birthYear || null,
                deathYear:data.deathYear || null,
                roles: 1
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