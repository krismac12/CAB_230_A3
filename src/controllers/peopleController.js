const peopleModel = require('../models/peopleModel');

const getPersonById = async (req, res) => {
    try {
        const id = req.params.id;
    
        // Fetch the person by ID from the database
        const person = await peopleModel.getPersonById(id);
    
        if (person) {
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