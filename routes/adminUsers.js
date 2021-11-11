var express = require("express");
var router = express.Router();
const adminHelper = require("../helpers/adminHelper");
const tldHelper = require("../helpers/tldHelpers");
const date = require("date-and-time");
const now = new Date();
const serviceHelper = require("../helpers/ServieHelpers");
const keywordHelper = require("../helpers/keywordsHelpers");
const fs = require("fs");
const csv = require("csvtojson");
const multer = require("multer");
const upload = multer({ dest: "upload/" });
var docxParser = require("docx-parser");
const passGenerator = require("otp-generator");
const mailer = require("../helpers/mailer");
const collection = require("../config/collection");
const verifyLogin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/login");
  }
};

router.get("/login", (req, res) => {
  res.render("user/login", { user: true });
});

router.post("/login", (req, res) => {
  adminHelper.doLogin(req.body,collection.ADMIN_COLLECTION).then((response) => {
    if (response._id) {
      req.session.admin = true;
      req.session.jobs = response.jobs;
      req.session.username = response.username;
      req.session.userType = response.usertype
      res.send(response.jobs)
    }else{
      res.send(response)
    }
  });
});


//sys admin redirection

//// add -service

router.get("/add-service", verifyLogin, (req, res) => {
  let userType;
  let userPriv =  req.session.userType
  let userName = req.session.username
  if(req.session.userType === 'ADMIN_USERS') userType = true
  serviceHelper.getAprovedService().then((approvedService) => {
    serviceHelper.getService().then((service) => {
      res.render("admin/add-service", {
        admin: true,
        service,
        approvedService,
        userType,
        userName,
        userPriv
      });
    });
  });
});

//add - tld
router.get("/add-tld", verifyLogin, (req, res) => {
  tldHelper.getTld().then((data) => {
    res.render("admin/add-tld", { admin: true, data });
  });
});

//confirm - tld
// confirm service
router.get("/confirm-tld", (req, res) => {
  tldHelper.getTld().then((data) => {
    serviceHelper.getService().then((serviceData) => {
      console.log(serviceData);
      res.render("admin/confirm-tld", { admin: true, data, serviceData });
    });
  });
});

router.get("/add-keyword", (req, res) => {
  keywordHelper.getCollectionName().then((data) => {
    keywordHelper.getAprovedColl().then((coll) => {
      res.render("admin/add-keyword", { admin: true, data, coll });
    });
  });
});

router.post("/add-keyword_table", (req, res) => {
  let resp = {};
  req.body.addDate = date.format(now, "ddd, MMM DD YYYY");
  req.body.addTime = date.format(now, "hh:mm A [GMT]Z", true);
  req.body.updateUser = req.session.username;
  keywordHelper
    .keywordCollectionExist(req.body.keyword_collection)
    .then((response) => {
      if (response) {
        resp.collection = "exist";
        res.json(resp);
      } else {
        keywordHelper.addCollection(req.body).then((status) => {
          resp.collection = "added";
          res.json(resp);
        });
      }
    });
});

//post add - tld
router.post("/addtld", (req, res) => {
  let tld = {};
  console.log(req.body);
  tldHelper.tldExist(req.body.TLD_NAME).then((response) => {
    if (response == true) {
      tld.ext = "exist";
      res.send(tld);
    } else {
      req.body.addDate = date.format(now, "ddd, MMM DD YYYY");
      req.body.addTime = date.format(now, "hh:mm A [GMT]Z", true);
      req.body.updateUser = req.session.username;
      console.log(req.body);
      tldHelper.addTld(req.body).then((status) => {
        if (status) {
          tld.add = true;
          res.send(tld);
        }
      });
    }
  });
});

///post approved tld
router.post("/tldstatusupdate", (req, res) => {
  req.body.adminUpdatedDate = date.format(now, "ddd, MMM DD YYYY");
  req.body.adminUpdateTime = date.format(now, "hh:mm A [GMT]Z");
  console.log(req.body);
  tldHelper.tldUpdate(req.body).then((status) => res.send(status));
});

router.post("/add-service", (req, res) => {
  console.log(req.body);
  const response = {};
  serviceHelper.serviceExist(req.body.service).then((status) => {
    if (status === true) {
      response.category = true;
      res.send(response);
    } else {
      req.body.addDate = date.format(now, "ddd, MMM DD YYYY");
      req.body.addTime = date.format(now, "hh:mm A [GMT]Z", true);
      req.body.updateUser = req.session.username;
      req.body.status = "pending";
      serviceHelper.addServie(req.body).then((status) => {
        if (status === true) {
          response.added = true;
          res.send(response);
        } else {
          response.added = false;
          res.send(response);
        }
      });
    }
  });
});
//admin aprove service
router.post("/update-service", (req, res) => {
  req.body.adminUpdatedDate = date.format(now, "ddd, MMM DD YYYY");
  req.body.adminUpdateTime = date.format(now, "hh:mm A [GMT]Z");
  console.log("adnubbhbf", req.body);
  serviceHelper.updateService(req.body).then((status) => {
    status ? res.send(true) : res.send(false);
    //create a database named service
  });
});
// add-category
router.post("/add-category", (req, res) => {
  console.log(req.body);
  const collection = "category_collection";
  serviceHelper.categoryExist(req.body.category, collection).then((status) => {
    if (status === true) {
      console.log("status exist");
      serviceHelper.updateStatus(
        req.body.category,
        req.body.service,
        collection
      );
    } else {
      serviceHelper
        .addCategory(req.body.service, req.body.category)
        .then((status) => {
          console.log(status);
        });
    }
  });
});

router.get("/servtst", (req, res) => {
  serviceHelper.getService().then((serviceData) => {
    console.log(serviceData);
    res.render("admin/service", { serviceData });
  });
});

router.get("/cat-tree", (req, res) => {
  keywordHelper.getAprovedColl().then((collName) => {
    res.render("admin/category-tree", { admin: true, collName });
  });
});

router.post("/update-collection-status", (req, res) => {
  console.log(req.body);
  keywordHelper.updateColl(req.body.id, req.body.status);
});

router.post("/upload-keyword", upload.single("myfile"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  let keywordId = req.body.coll;
  let keywordArray = [];
  if (req.file.mimetype === "text/csv") {
    csv({
      output: "line",
      trim: true,
    })
      .fromFile(req.file.path)
      .then((csvData) => {
        // console.log(csvData.replace(/^"(.*)"$/, '$1'))
        let splitedKeyword = csvData.toString().split(/\s+/).sort();
        for (i in splitedKeyword) {
          let data = {
            keyword_name: splitedKeyword[i],
          };
          keywordArray.push(data);
        }
      })
      .then((err) => {
        if (err) throw err;
        else {
          keywordHelper.findColl(keywordId).then((key) => {
            keywordHelper
              .addCsv(key.keyword_collection, keywordArray)
              .then((status) => {
                if (status === true) {
                  fs.unlinkSync(req.file.path);
                  res.send(true);
                }
              });
          });
        }
      });
  } else if (req.file.mimetype === "application/wps-office.docx") {
    console.log(req.file);
    console.log(req.file.originalname);

    docxParser.parseDocx(req.file.path, async function (data) {
      let keywordData = data.split(/\s+/).sort();
      for (i in keywordData) {
        let data = {
          keyword_name: keywordData[i],
        };
        keywordArray.push(data);
      }
      keywordHelper.findColl(keywordId).then((key) => {
        keywordHelper
          .addCsv(key.keyword_collection, keywordArray)
          .then((status) => {
            if (status === true) {
              fs.unlinkSync(req.file.path);
              res.send(true);
            }
          });
      });
    });
  } else if (req.file.mimetype === "text/plain") {
    console.log("hellooo");
    fs.readFile(req.file.path, function (err, data) {
      if (err) throw err;
      // data will contain your file contents
      let textData = data.toString().split("\n").sort();
      for (i in textData) {
        let data = {
          keyword_name: textData[i],
        };
        keywordArray.push(data);
      }

      keywordHelper.findColl(keywordId).then((key) => {
        keywordHelper
          .addCsv(key.keyword_collection, keywordArray)
          .then((status) => {
            if (status === true) {
              fs.unlinkSync(req.file.path);
              res.send(true);
            }
          });
      });
    });
  } else {
    fs.unlink(req.file.path, function (err) {
      if (err) throw err;
      res.send(false);
    });
  }
});
//get keyword based on drop-down
router.post("/get-keywords", (req, res) => {
  console.log(req.body);
  keywordHelper.findColl(req.body.collId).then((collData) => {
    keywordHelper.getCsv(collData.keyword_collection).then((keywords) => {
      console.log(keywords);
      res.json(keywords);
    });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//testing 2 drag and drop
router.get("/drag", (req, res) => {
  keywordHelper.getAprovedColl().then((collName) => {
    let coll = "Real_Estate";
    keywordHelper.getCsv(coll).then((keywords) => {
      console.log(keywords);
      res.render("admin/drag-and-drop", { admin: true, keywords });
    });
  });
});

router.get("/cat", (req, res) => {
  keywordHelper.getAprovedColl().then((service) => {
    let coll = "Real_Estate";
    console.log(service);
    keywordHelper.getCsv(coll).then((keywords) => {
      res.render("admin/cat-test", { admin: true, service, keywords });
    });
  });
});

router.post("/submit-keyword", (req, res) => {
  console.log(req.body);
  let keywords = [];
  let data = req.body.cat;
  console.log(typeof data);
  if (typeof data === "string") {
    let data = {
      keyword: req.body.cat,
    };
    keywordHelper.submitSingleKey(data).then((response) => {
      response ? res.send(true) : res.send(false);
    });
  } else {
    data.forEach((element) => {
      let keywordData = {
        keyword: element,
      };
      keywords.push(keywordData);
    });
    keywordHelper.submitKeywords(keywords).then((response) => {
      response ? res.send(true) : res.send(false);
    });
  }
});



router.get("/reset-password", (req, res) => {
  res.render("user/reset-pass", { user: true });
});

router.post("/reset-password", (req, res) => {
  adminHelper.ifUser(req.body.email,collection.ADMIN_COLLECTION).then((user) => {
    if (!user) {
      res.send("no-user");
    } else {
      const passId = passGenerator.generate(4, {
        upperCase: false,
        specialChars: false,
      });
      adminHelper.updatePass(passId, user._id).then((resp) => {
        if (!resp) res.send("wrong");
        else {
          adminHelper.getUser(user._id).then((user) => {
            if (!user) res.send("wrong");
            else {
              adminHelper.updateUserStatus(user._id, false).then((user) => {
                if (!user) res.send("wrong");
                else res.send("submited");
              });
            }
          });
        }
      });
    }
  });
});

router.post('/add-deptuser',(req,res)=>{
  let resp = {};
 adminHelper.ifUser(req.body.email,collection.ADMIN_COLLECTION).then((user)=>{
   if(!user){
    req.body.status = true;
    req.body.usertype = 'DEPT_USERS'
    req.body.addedUser = req.session.username
    adminHelper.addAdminUser(req.body,collection.ADMIN_COLLECTION).then((resp)=>{
      if(!resp) console.log(resp)
      else res.json(true)
    })
   }else {
    resp.user = true;
      res.json(resp);
   }
 })
})

module.exports = router;
