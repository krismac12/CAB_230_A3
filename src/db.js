const knex = require('knex');
const mysql = require('mysql2');

// Create a Knex instance
const db = knex({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'movies'
    },
    debug: true // Enable query logging
});

module.exports = db;
