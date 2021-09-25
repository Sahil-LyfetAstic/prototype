var express = require('express');
var router = express.Router();
const adminHelper = require('../helpers/adminHelper')
const keywordHelper = require('../helpers/keywordsHelpers')

/* GET users listing. */

router.get('/sysadmin',(req,res)=>{
    keywordHelper.getCollectionName().then((data)=>{
        res.render('sysadmin/sysadmin-home',{admin:true,data})
    })
  
})


router.post('/add-adminuser',(req,res)=>{
   adminHelper.addAdminUser(req.body).then((response)=>{
       res.json(true)
   })
})
module.exports = router;
