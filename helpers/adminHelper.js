const db = require("../config/connection3");
const collection = require("../config/collection");

module.exports = {
  doLogin: (userData) => {
    console.log(userData);
    let response = {};
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ username: userData.username })
        .then((user) => {
          if (user.password == userData.password) {
            resolve(user);
          } else {
            console.log('incorrect password')
          }
        });
    });
  },
  addAdminUser: (userData) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.ADMIN_COLLECTION).insertOne(userData).then((status) => {
        if(status) resolve(true)
        else resolve(false)
      })
    })
  }

};
