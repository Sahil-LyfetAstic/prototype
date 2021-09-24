const db = require("../config/serviceConnection");
const collection = require("../config/collection");
const DYN_DB = require("../config/dynConnection");
const dynamicDb = require("../config/dynConnection");
const objId = require("mongodb").ObjectId;

module.exports = {
  addServie: (serviceData) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.SERVICE_COLLECTION)
        .insertOne(serviceData)
        .then((status) => {
          status ? resolve(true) : resolve(false);
        });
    });
  },
  serviceExist: (serviceName) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.SERVICE_COLLECTION)
        .findOne({ service: serviceName })
        .then((service) => {
          service ? resolve(true) : resolve(false);
        });
    });
  },
  getService: () => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.SERVICE_COLLECTION)
        .find()
        .toArray()
        .then((serviceData) => {
          serviceData ? resolve(serviceData) : console.log("no data available");
        });
    });
  },
  updateService: (serviceData) => {
    console.log(serviceData);
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.SERVICE_COLLECTION)
        .updateOne(
          { _id: objId(serviceData.id) },
          {
            $set: {
              status: serviceData.status,
              adminUpdatedDate: serviceData.adminUpdatedDate,
              adminUpdateTime: serviceData.adminUpdateTime,
            },
          },
        )
        .then((status) => {
          status ? resolve(true) : console.log("service add error");
        });
    });
  },
  addCategory: (serviceId, cat) => {
    category = {
      category: cat,
      relation: [serviceId],
    };
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORY_COLLECTION)
        .insertOne(category)
        .then((status) => {
          console.log(status);
        });
    });
  },
  categoryExist: (cat, collection) => {
    console.log(cat);
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection)
        .findOne({ category: cat })
        .then((status) => {
          status ? resolve(true) : resolve(false);
        });
    });
  },
  updateStatus: (cat, serviceId, collection) => {
    console.log(serviceId);
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection)
        .updateOne(
          { category: cat },
          {
            $push: {
              relation: serviceId,
            },
          },
        )
        .then((status) => {
          console.log(status);
        });
    });
  },

  getAprovedService: () => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.SERVICE_COLLECTION)
        .find({ status: "approved" })
        .toArray()
        .then((status) => {
          console.log(status)
          status ? resolve(status) : console.log("something fishy");
        });
    });
  },

  createDb: (dbName, collection) => {
    return new Promise(async (resolve, reject) => {
      await DYN_DB.connect(dbName, (err) => {
        if (err) console.log(err);
        else {
          dynamicDb.get().collection(collection).insertOne();
        }
      });
    });
  },
};
