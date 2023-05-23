const db = require('../db');

// principalModel exports

module.exports = {
    getPrincipalsByID: (id) => {
        return db.select("*").from("principals").where("tconst",id);
    }
}