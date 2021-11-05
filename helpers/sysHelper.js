const adminDb = require("../config/connection3");
const collection = require("../config/collection");
const objId = require("mongodb").ObjectId;

module.exports = {
  passChangingReq: () => {
    return new Promise(async (resolve, rejecet) => {
      await adminDb
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .find({
          status: false,
        })
        .toArray()
        .then((users) => {
          users ? resolve(users) : resolve(false);
        })
        .catch((err) => rejecet(err));
    });
  },
};
