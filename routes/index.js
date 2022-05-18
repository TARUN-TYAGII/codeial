const express = require("express");

const router = express.Router();
const homeController = require("../controller/homeController");

router.get("/", homeController.home);
router.use("/user", require("./user"));
router.use("/post", require("./post"));
router.use("/comment", require("./comment"));
router.use("/api", require("./api"));
router.use("/like", require("./like"));

module.exports = router;
