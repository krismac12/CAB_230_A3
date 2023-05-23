const db = require('../db');


module.exports = {

    getPersonById: (id) => {
      const query = db.select('*').from('names').where('nconst', id).toSQL().toNative();
      console.log('getMovieById SQL query:', query); // Log the query to the console
      return db.select('*').from('names').where('nconst', id).first();
    },
};