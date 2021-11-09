var express = require("express");
var router = express.Router();
const adminHelper = require("../helpers/adminHelper");
const keywordHelper = require("../helpers/keywordsHelpers");
const serviceHelper = require("../helpers/ServieHelpers");
const sysHelper = require("../helpers/sysHelper");
const mailer = require("../helpers/mailer");
const collection = require("../config/collection");

/* GET users listing. */

router.get("/sysadmin", (req, res) => {
  keywordHelper.getCollectionName().then((data) => {
    sysHelper.passChangingReq(false).then((passUsers) => {
      res.render("sysadmin/sysadmin-home", { admin: true, data, passUsers });
    });
  });
});

router.post("/add-adminuser", (req, res) => {
  let resp = {};
  adminHelper.ifUser(req.body.email,collection.ADMIN_COLLECTION).then((user) => {
    if (!user) {
      req.body.status = true;
      req.body.usertype = "ADMIN_USERS";
      adminHelper
        .addAdminUser(req.body, collection.ADMIN_COLLECTION)
        .then((response) => {
          res.json(true);
        });
    } else {
      resp.user = true;
      res.json(resp);
    }
  });
});

router.post("/update-reset-password", (req, res) => {
  if (req.body.status === "approved") {
    adminHelper.getUser(req.body.id).then((user) => {
      if (!user) res.send(false);
      else {
        mailer.resetPassword(user.password, user.email).then((stat) => {
          if (!stat) res.send(false);
          else {
            adminHelper.updateUserStatus(user._id, true).then((resp) => {
              if (resp) res.send(true);
            });
          }
        });
      }
    });
  }
});
module.exports = router;
