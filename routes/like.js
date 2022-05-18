const express = require("express");
const router = express.Router();
const likeController = require("../controller/likes_controller");

router.post("/toggleLike", likeController.toggleLike);

module.exports = router;
