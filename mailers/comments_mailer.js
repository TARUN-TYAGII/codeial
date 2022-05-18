const nodemailer = require("../config/nodemailer");

exports.newComment = (comment) => {
  console.log("COmmment", comment);
  let htmlString = nodemailer.renderTemplate(
    { comment: comment },
    "comment/new_comment.ejs"
  );
  nodemailer.transporter.sendMail(
    {
      from: "tyagiishiva@gmail.com",
      to: comment.user.email,
      subject: "New comment Published",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending the mail", err);
        return;
      }

      console.log("Information", info);
    }
  );
};
