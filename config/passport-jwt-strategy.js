const passport = require("passport");
const passportJWT = require("passport-jwt").Strategy;
ExtractJwt = require("passport-jwt").ExtractJwt;
const env = require("../config/environment");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwt_secret,
};

passport.use(
  new passportJWT(opts, function (jwtPayload, done) {
    User.findOne(jwtPayload._id, function (err, user) {
      if (err) {
        console.log("Error in authenticating using JWT", err);
        return;
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

module.exports = passport;
