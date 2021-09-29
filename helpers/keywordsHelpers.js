const db = require("../config/keywordDb");
const collection = require("../config/collection");
const objId = require("mongodb").ObjectId;

module.exports = {
  addCollection: (collectionName) => {
    console.log(collectionName);
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.APPROVEL_COLLECTION)
        .insertOne(collectionName)
        .then((status) => {
          status ? resolve(true) : resolve(false);
        });
    });
  },
  keywordCollectionExist: (key) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.APPROVEL_COLLECTION)
        .findOne({ keyword_collection: key })
        .then((status) => {
          status ? resolve(status) : resolve(false);
        });
    });
  },
  getCollectionName: () => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.APPROVEL_COLLECTION)
        .find()
        .toArray()
        .then((data) => {
          resolve(data);
        });
    });
  },
  updateColl: (collId, status) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.APPROVEL_COLLECTION)
        .updateOne(
          {
            _id: objId(collId),
          },
          {
            $set: { status: status },
          }
        )
        .then((response) => {
          console.log(response);
        });
    });
  },
  getAprovedColl: () => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.APPROVEL_COLLECTION)
        .find({
          status: "approved",
        })
        .toArray()
        .then((data) => {
          resolve(data);
        });
    });
  },
  findColl: (collId) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.APPROVEL_COLLECTION)
        .findOne({ _id: objId(collId) })
        .then((coll) => {
          resolve(coll);
        });
    });
  },
  addCsv: (coll, csv) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(coll)
        .insertMany(csv)
        .then((data) => {
          if (data) resolve(true);
          else resolve(false);
        });
    });
  },
  getCsv:(coll)=>{
    return new Promise(async(resolve,reject)=>{
      await db.get().collection(coll).find().toArray().then((data)=>{
       resolve(data)
      })
    })
  }
};
