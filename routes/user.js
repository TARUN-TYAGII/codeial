const express = require("express");

const router = express.Router();
const passport = require("passport");
const userController = require("../controller/userController");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  userController.profile
);

router.post("/update/:id", passport.checkAuthentication, userController.update);

router.get("/sign-up", userController.signUp);
router.get("/sign-in", userController.signIn);

router.post("/create", userController.create);

// using passport as a middleware
router.post(
  "/createSession",
  passport.authenticate("local", { failureRedirect: "/user/sign-in" }),
  userController.createSession
);

router.get("/signOut", userController.destroySession);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/user/sign-in",
    successRedirect: "/",
  })
);

module.exports = router;
