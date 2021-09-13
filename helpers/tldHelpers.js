const db = require("../config/connection1");
const collection = require("../config/collection");
const objId = require("mongodb").ObjectId;

module.exports = {
  addTld: (tldData) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.TOP_LEVEL_DOMAIN)
        .insertOne(tldData)
        .then((tld) => {
          resolve(tld);
        });
    });
  },
  tldExist: (TLD_NAME) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.TOP_LEVEL_DOMAIN)
        .findOne({ TLD_NAME: TLD_NAME })
        .then((tld) => {
          tld ? resolve(true) : resolve(false);
        });
    });
  },
  getTld: () => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.TOP_LEVEL_DOMAIN)
        .find()
        .toArray()
        .then((tld) => {
          resolve(tld);
        });
    });
  },
  tldUpdate: (updateData) => {
    let id = updateData.id;
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.TOP_LEVEL_DOMAIN)
        .updateOne(
          { _id: objId(id) },
          {
            $set: {
              TLD_STAT: updateData.TLD_STAT,
              adminUpdatedDate: updateData.adminUpdatedDate,
              adminUpdateTime:updateData.adminUpdateTime

            },
          }
        )
        .then((data) => {
          data ? resolve(true) : console.log("cannot add this");
        });
    });
  },
  getApprovedtld: () => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.TOP_LEVEL_DOMAIN)
        .find({ TLD_STAT: "approved" })
        .toArray()
        .then((ext) => {
          resolve(ext);
        });
    });
  },
};
