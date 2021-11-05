const db = require("../config/connection3");
const collection = require("../config/collection");
const objId = require("mongodb").ObjectId;

module.exports = {
  doLogin: (userData) => {
    console.log(userData);
    let response = {};
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ username: userData.username })
        .then((user) => {
          if (user.status === false) {
            console.log("status ");
          } else {
            if (user.password == userData.password) {
              resolve(user);
            } else {
              console.log("incorrect password");
            }
          }
        });
    });
  },
  addAdminUser: (userData) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ADMIN_COLLECTION)
        .insertOne(userData)
        .then((status) => {
          if (status) resolve(true);
          else resolve(false);
        });
    });
  },
  ifUser: (emailId) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ email: emailId })
        .then((user) => {
          if (user) resolve(user);
          else resolve(false);
        });
    });
  },
  updatePass: (passId, userId) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .updateOne(
          {
            _id: objId(userId),
          },
          {
            $set: {
              password: passId,
            },
          }
        )
        .then((res) => {
          if (!res) resolve(false);
          else resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getUser: (userId) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ _id: objId(userId) })
        .then((user) => {
          user ? resolve(user) : resolve(false);
        })
        .catch((err) => console.log(err));
    });
  },
  updateUserStatus: (userId, status) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .updateOne(
          {
            _id: objId(userId),
          },
          {
            $set: {
              status: status,
            },
          }
        )
        .then((resp) => {
          resp ? resolve(resp) : resolve(false);
        })
        .catch((err) => reject(err));
    });
  },
};
