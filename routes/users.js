var express = require("express");
var router = express.Router();
const tldHelper = require("../helpers/tldHelpers");
const domHelper = require("../helpers/domHelpers");
const userHelper = require("../helpers/userHelpers");
const mailer = require("../helpers/mailer");
const fs = require("fs");
const { handlebars } = require("hbs");
const collection = require("../config/collection");
const hostSug = require("../helpers/hostingSuggetion");
const primeuserHelper = require('../helpers/dynamicDb')
const user = true;

router.get("/", (req, res) => {
  res.render("user/primeuser-registration/register-1.hbs", { user });
});

//no domain user
router.get("/no-domain", (req, res) => {
  res.render("user/primeuser-registration/no-domain");
});

//registration start
router.post("/service-registration", (req, res) => {
  if (
    req.body.domain == "true" &&
    req.body.host == "true" &&
    req.body.email == "true"
  ) {
    tldHelper.getApprovedtld().then((data) => {
      res.render("user/primeuser-registration/user-otherhosting", {
        user,
        data,
      });
    });
  } else if (
    req.body.domain == "true" &&
    req.body.host == "true" &&
    req.body.email == "false"
  ) {
    tldHelper.getApprovedtld().then((data) => {
      res.render("user/primeuser-registration/user-withno-email", {
        user,
        data,
      });
    });
  } else if (
    req.body.domain == "true" &&
    req.body.host == "false" &&
    req.body.email == "true"
  ) {
    hostSug.getHostingDetails().then((data) => {
      res.render("user/primeuser-registration/hosting-suggetion", {
        user,
        data,
      });
    });
  } else {
    hostSug.getHostingDetails().then((data) => {
      res.render("user/primeuser-registration/hosting-suggetion", {
        user,
        data,
      });
    });
  }
});

//licensing
router.post("/primeuser-register", (req, res) => {
  const userData = {
    Domain: req.body.Domain,
    domainExtension: req.body.domainExtension,
  };
  let collection = "PRIME_USER";
  userHelper.addDomDb(userData).then((userId) => {
    console.log(userId)
    userHelper.doRegister(req.body, userId, collection).then((status) => {
      if (status) {
        console.log(req.body);
        let Data = {
          mailID:
            req.body.ed + "@" + req.body.Domain + req.body.domainExtension,
          licenseKey: req.body.licenseKey,
        };
        const dbName = req.body.Domain+'_'+req.body.domainExtension
        const PRIME_USER_collection = "admin_collection"
        primeuserHelper.createDb(dbName,req.body,PRIME_USER_collection)
        mailer.sendEmail(Data.mailID, Data.licenseKey).then((response) => {
          if (response == true) {
            res.render("user/primeuser-registration/home", {
              message: "check your mail to continue",
            });
          } else {
            res.render("user/primeuser-registration/home", {
              message: "mail send to this email id err",
            });
          }
        });
      }
    });
  });
});

router.post("/primeuser-register-noemail", (req, res) => {
  const collection = collection.NO_EMAIL_USER;
  const userData = {
    Domain: req.body.Domain,
    domainExtension: req.body.domainExtension,
  };
  userHelper.addDomDb(userData).then((userId) => {
    userData.doRegister(req.body, userId, collection).then((data) => {
      if (status == true) {
        const userId = req.body._id;
        const domainExtension =
          "@" + req.body.Domain + "." + req.body.domainExtension;

        fs.readFile(
          "./views/user/share/mail-template.hbs",
          { encoding: "utf-8" },
          (err, html) => {
            let data = handlebars.compile(html);
            let result = data({ userId, domainExtension });

            if (err) console.log(err);
            else
              mailer.verifyEmail(req.body.aditionalemail, result, req.body._id);
          }
        );

        res.render("user/primeuser-registration/home", {
          message: "check your personal email to continue",
        });
      }
    });
  });
});

router.post("/mail-submit", (req, res) => {
  let userId = req.query.key;
  let email = req.body.email;
  userHelper.userExist(userId, collection.NO_EMAIL_USER).then((user) => {
    if (user) {
      delete user._id;
      user.ed = email;
      //add user to dom_table
      domHelper.doRegister(user).then((response) => {
        if (response) {
          let data = {
            mailId: user.ed + "@" + user.Domain + "." + user.domainExtension,
          };
          mailer.sendEmail(data.mailId, user.licenseKey).then((response) => {
            if (response == true) {
              res.render("user/primeuser-registration/home", {
                message: "check your mail to continue",
              });
            } else {
              res.render("user/primeuser-registration/home", {
                message: "mail send to this email id error",
              });
            }
          });
        }
      });
    } else {
      res.render("user/primeuser-registration/home", {
        message: "no user find",
      });
    }
  });
});

router.get("/license-verify/", (req, res) => {
  console.log("req recieved");
  let licenseKey = req.query.key;
  helpers.isLiceseValid(licenseKey).then((status) => {
    let name = status.fname;
    if (status) res.render("user/share/welcome", { name });
    else console.log("license key is not valis");
  });
});

module.exports = router;


