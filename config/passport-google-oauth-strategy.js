const passport = require("passport");
const googleStrategy = require("passport-google-oauth2");
const crypto = require("crypto");
const User = require("../model/user");
const env = require("../config/environment");

passport.use(
  new googleStrategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: env.google_call_back_url,
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("PROFILE", profile);
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("Error in creating the google authentication", err);
          return;
        }

        if (user) {
          return done(null, user);
        } else {
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            },
            function (err, user) {
              if (err) {
                console.log(
                  "Error in creating the user using google authentication",
                  err
                );
                return;
              }

              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
