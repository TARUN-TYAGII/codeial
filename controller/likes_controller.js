const Post = require("../model/post");
const User = require("../model/user");
const Like = require("../model/like");
const Comment = require("../model/comment");
const nodemailer = require("../config/nodemailer");

module.exports.toggleLike = async function (req, res) {
  try {
    let likeable;
    let deleted = false;

    if (req.query.type == "Post") {
      likeable = await Post.findById(req.query.id).populate("likes");
    } else {
      likeable = await Comment.findById(req.query.id).populate("likes");
      console.log(likeable);
    }

    let existingLike = await Like.findOne({
      likeable: req.query.id,
      onModel: req.query.type,
      user: req.user._id,
    });

    if (existingLike) {
      likeable.likes.pull(existingLike._id);
      likeable.save();

      existingLike.remove();
      deleted = true;
    } else {
      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type,
      });

      likeable.likes.push(newLike._id);
      likeable.save();
    }

    return res.json(200, {
      message: "Request Successfull!!!",
      data: {
        deleted: deleted,
      },
    });
  } catch (err) {
    if (err) {
      console.log(err);
      return res.status(401).json(
        {
          message: "Error in liking a post",
        },
        err
      );
    }
  }
};
