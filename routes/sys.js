var express = require("express");
var router = express.Router();
const adminHelper = require("../helpers/adminHelper");
const keywordHelper = require("../helpers/keywordsHelpers");
const serviceHelper = require("../helpers/ServieHelpers");
const sysHelper = require("../helpers/sysHelper");
const mailer = require("../helpers/mailer");

/* GET users listing. */

router.get("/sysadmin", (req, res) => {
  keywordHelper.getCollectionName().then((data) => {
    sysHelper.passChangingReq(false).then((passUsers) => {
      res.render("sysadmin/sysadmin-home", { admin: true, data, passUsers });
    });
  });
});

router.post("/add-adminuser", (req, res) => {
  req.body.status = true;
  adminHelper.addAdminUser(req.body).then((response) => {
    res.json(true);
  });
});

router.post("/update-reset-password", (req, res) => {
  if (req.body.status === "approved") {
    adminHelper.getUser(req.body.id).then((user) => {
      if (!user) res.send(false)
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
