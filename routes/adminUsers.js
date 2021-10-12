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
const verifyLogin = (req, res, next) => {
  if (req.session.subadmin) {
    next();
  } else {
    res.redirect("/login");
  }
};

router.get("/login", (req, res) => {
  res.render("user/login", { user: true });
});
router.post("/login", (req, res) => {
  adminHelper.doLogin(req.body).then((response) => {
    if (response) {
      console.log(response.jobs);
      req.session.subadmin = true;
      req.session.jobs = response.jobs;
      req.session.username = response.username;

      res.redirect("/" + response.jobs);
    }
  });
});

//// add -service

router.get("/add-service", verifyLogin, (req, res) => {
  serviceHelper.getAprovedService().then((approvedService) => {
    serviceHelper.getService().then((service) => {
      res.render("subAdmin/add-service", {
        admin: true,
        service,
        approvedService,
      });
    });
  });
});

//add - tld
router.get("/add-tld", verifyLogin, (req, res) => {
  tldHelper.getTld().then((data) => {
    res.render("subAdmin/add-tld", { admin: true, data });
  });
});

//confirm - tld
// confirm service
router.get("/confirm-tld", (req, res) => {
  tldHelper.getTld().then((data) => {
    serviceHelper.getService().then((serviceData) => {
      console.log(serviceData);
      res.render("subAdmin/confirm-tld", { admin: true, data, serviceData });
    });
  });
});

router.get("/add-keyword", (req, res) => {
  keywordHelper.getCollectionName().then((data) => {
    keywordHelper.getAprovedColl().then((coll) => {
      res.render("subAdmin/add-keyword", { admin: true, data, coll });
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
    res.render("subAdmin/service", { serviceData });
  });
});

router.get("/cat-tree", (req, res) => {
  keywordHelper.getAprovedColl().then((collName) => {
    res.render("subAdmin/category-tree", { admin: true, collName });
  });
});

router.post("/update-collection-status", (req, res) => {
  console.log(req.body);
  keywordHelper.updateColl(req.body.id, req.body.status);
});

router.post("/upload-keyword", upload.single("myfile"), (req, res) => {
  console.log(req.body)
  let keywordId = req.body.coll
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
                  console.log("keyword added success");
                }
              });
          });
        }
      });
  } else if (req.file.mimetype === "application/wps-office.docx") {
    console.log(req.file);
    console.log(req.file.originalname);
    docxParser
      .parseDocx(req.file.path, function (data) {
        let keywordData = data.split(/\s+/).sort();
        for (i in keywordData) {
          let data = {
            keyword_name: keywordData[i],
          };
          // console.log(data)
          keywordArray.push(data);
        }
      })
      .then((err) => {
        if (err) throw err;
        else {
          console.log(req.body.coll)
          keywordHelper.findColl(keywordId).then((key) => {
            console.log(key)

            // keywordHelper
            //   .addCsv(key.keyword_collection, keywordArray)
            //   .then((status) => {
            //     if (status === true) {
            //       fs.unlinkSync(req.file.path);
            //       console.log("keyword added success");
            //     }
            //   });
          });
        }
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
      res.render("subAdmin/drag", { admin: true, keywords });
    });
  });
});
module.exports = router;
