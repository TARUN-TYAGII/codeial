const User = require("../model/user");
const fs = require("fs");
const path = require("path");

module.exports.profile = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log("Error in finding the profile of user", err);
      return;
    }
    return res.render("profile", {
      title: "User Profile",
      profile_user: user,
    });
  });
};

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/profile");
  }
  return res.render("user_sign_up", {
    title: "sign up",
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/profile");
  }
  return res.render("user_sign_in", {
    title: "sign in",
  });
};

module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding the user in signing up");
      return;
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("Error in creating the user in signing up");
          return;
        }

        return res.redirect("/user/sign-up");
      });
    } else {
      return res.redirect("back");
    }
  });
};

// module.exports.createSession = function (req, res) {
//   //steps to authenticate
//   // find the user
//   User.findOne({ email: req.body.email }, function (err, user) {
//     if (err) {
//       console.log("Error in signing in the user", err);
//       return;
//     }

//     if (user) {
//       if (user.password != req.body.password) {
//         return res.redirect("back");
//       }

//       res.cookie("user_id", user.id);
//       return res.redirect("/user/profile");
//     } else {
//       return res.redirect("back");
//     }
//   });
// };

module.exports.createSession = function (req, res) {
  // req.flash("success", "Logged In Successfully");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash("success", "Sign Out Successfully");
  return res.redirect("/user/sign-in");
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);

      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("Error", err);
          return;
        }
       
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          if (
            user.avatar &&
            fs.existsSync(path.join(__dirname, "..", user.avatar))
          ) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
      
        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      console.log("Error", err);
      req.flash("error", err);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized");
    return res.status(401).send("Unauthorized");
  }
};
