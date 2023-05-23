const db = require('../db');

// principalModel exports

module.exports = {
    getPrincipalsbyID: (id) => {
        return db.select("*").from("principals").where("tconst",id);
    }
}