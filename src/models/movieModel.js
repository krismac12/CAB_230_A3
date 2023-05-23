const db = require('../db');

// Movie model methods
module.exports = {
    getAllMovies: (page, moviesPerPage) => {
        const startIndex = (page - 1) * moviesPerPage;
        return db.select('*').from('basics').offset(startIndex).limit(moviesPerPage);
    },

    getMovieById: (id) => {
      const query = db.select('*').from('basics').where('tconst', id).toSQL().toNative();
      console.log('getMovieById SQL query:', query); // Log the query to the console
      return db.select('*').from('basics').where('tconst', id).first();
    },
};
