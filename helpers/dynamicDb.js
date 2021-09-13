const db = require("../config/dynConnection");
const collection = require("../config/collection");
const DYN_DB = require("../config/dynConnection");

module.exports = {
  createDb: (dbName, userData,collection) => {
    return new Promise(async (resolve, reject) => {
      DYN_DB.connect(dbName, (err) => {
        if (err) console.log(err);
        else {
          db.get()
            .collection(collection)
            .insertOne(userData)
            .then((status) => {
              console.log(status);
            });
        }
      });
    });
  },
};
