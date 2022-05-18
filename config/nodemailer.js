const nodemailer = require("nodemailer");
const env = require("../config/environment");
const ejs = require("ejs");
const path = require("path");

// this is part which sends the email
let transporter = nodemailer.createTransport(env.smtp);

// define whenever we send the HTML file
let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    (err, template) => {
      if (err) {
        console.log("Error in sending the mail", err);
        return;
      }

      mailHTML = template;
    }
  );
  return mailHTML;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
