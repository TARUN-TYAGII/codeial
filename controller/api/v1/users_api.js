const User = require("../../../model/user");
const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user || user.password != req.body.password) {
      return res.status(422).json({
        message: "Invalid username / password",
      });
    }

    return res.status(200).json({
      message: "Sign in successgully",
      data: {
        token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: 100000 }),
      },
    });
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};
