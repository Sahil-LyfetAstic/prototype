const db = require ('../config/userDb')


module.exports={
  addUser:(userData)=>{
    const collection = userData.collection
    return new Promise((resolve,reject)=>{
      db.get().collection(collection).insertOne(userData).then((status) => {
        console.log(status)
      }).catch((err) => {
        
      });
    })
  }
}