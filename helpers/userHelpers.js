const db = require("../config/connection2");
const license = require("randomstring");
const db1 = require("../config/userDb");
const domDb = require('../config/connection2')
const collection = require("../config/collection");
const objId = require("mongodb").ObjectId;
const userDb = require('../config/userDb')

module.exports = {
  doRegister: (userData,userId,collection) => {
    const licenseKey = license.generate();
    userData.licenseKey = licenseKey;
    return new Promise((resolve, reject) => {
      userDb.get()
        .collection(collection)
        .insertOne(userData,{
          $set:{
            _id:userId
          }
        })
        .then((status) => {
          
          console.log(status);
          status ? resolve(status.insertedId) : resolve(false);
        });
    });
  },
  findUser: (userId, collection) => {
    console.log(userId);
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collection)
        .findOne({ _id: userId })
        .then((user) => {
          console.log(user);
        })
        .catch((err) => {
          throw err;
        });
    });
  },
  addUser: (userData,collection) => {
    console.log(userData);
    return new Promise((resolve, reject) => {
      db1
        .get()
        .collection(collection)
        .insertOne(userData)
        .then((status) => {
          status ? resolve(true) : resolve(false)
        });
    });
  },
  userExist:(userId,collection)=>{
    return new Promise(async(resolve,reject)=>{
      db1.get().collection(collection).findOne({_id:objId(userId)}).then((user)=>{
        user ? resolve(user) : resolve(false)
      })
    })
  },
  addDomDb:(userData)=>{
    const collection = 'dom_'+userData.domainExtension
    console.log(collection)
    return new Promise((resolve,reject)=>{
      domDb.get().collection(collection).insertOne(userData).then((userId)=>{
        console.log(userId)
        resolve(userId.insertedId)
      })
    })
  }
  
};
