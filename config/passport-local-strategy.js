const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../model/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          req.flash("Error", err);
          return done(err, false);
        }

        if (!user || user.password != password) {
          req.flash("error", "Invalid username/password");
          return done(null, false);
        }

        return done(null, user);
      });
    }
  )
);

//serializing the user to find which key is to be kept as cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// deseailizing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding the user--> Passport");
      return done(err);
    }

    return done(null, user);
  });
});

passport.checkAuthentication = function (req, res, next) {
  // if user is sign in then pass on the req to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }
  // if user is not signed in
  return res.redirect("/user/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views

    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
