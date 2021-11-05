const admin = require("../config/mailer.js");
const mailer = require("nodemailer");
const generator = require("generate-password");
const helpers = require("../helpers/userHelpers");
const fs = require("fs");

const transport = mailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  ignoreTLS: false,
  secure: false,
  auth: {
    user: admin.GMAIL_USER,
    pass: admin.GMAIL_PASS,
  },
});

let user = {
  password: generator.generate({
    length: 10,
    numbers: true,
  }),
};
module.exports = {
  sendEmail: (emailId, userId) => {
    return new Promise((resolve, reject) => {
      let licenseKey = "http://localhost:3000/license-verify/?key=" + userId;
      const mailOption = {
        from: "sahilsaalu@gmail.com",
        to: emailId,
        subject: "verify your email",
        text: licenseKey,
      };
      transport.sendMail(mailOption, (err, info) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          console.log(info);
          console.log("mail send succes", info.response);
          resolve(true);
        }
      });
    });
  },
  verifyEmail: (emailId, html, userId) => {
    return new Promise((resolve, reject) => {
      const mailOption = {
        from: "sahilsaalu@gmail.com",
        to: emailId,
        subject: "verify your email",
        html: html,
      };
      transport.sendMail(mailOption, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    });
  },
  resetPassword:(otpId,mailId)=>{
    return new Promise(async(resolve,reject)=>{
      const mailOption = {
        from: "admin@resurs.com",
        to: mailId,
        subject: "otp",
        text: otpId,
      };
      transport.sendMail(mailOption, async(err, info) => {
        if (err) {
          console.log(err);
          await resolve(false);
        } else {
          console.log(info);
          console.log("mail send succes", info.response);
         await resolve(true);
        }
      });

    })
  }
};
