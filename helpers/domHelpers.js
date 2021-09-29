const db = require("../config/connection2");
const license = require("randomstring");
module.exports = {
  doRegister: (userData) => {
    return new Promise(async (resolve, reject) => {
      const COLLECTION_NAME = "DOM_" + userData.domainExtension;
      const licenseKey = license.generate();
      userData.licenseKey = licenseKey;
      db.get()
        .collection(COLLECTION_NAME)
        .insertOne(userData)
        .then((response) => {
          response ? resolve(response) : console.log(response);
        });
    });
  },
  ifUser: (licenseKey, collection) => {
    db.get()
      .collection(collection)
      .findOne({ licenseKey: licenseKey })
      .then((user) => {
        user ? resolve(true) : resolve(false);
      })
      .catch((err) => {
        throw err;
      });
  },
};
