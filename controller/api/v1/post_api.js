const Post = require("../../../model/post");
const Comment = require("../../../model/comment");
const User = require("../../../model/user");

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path: "comment",
      populate: {
        path: "user",
      },
    });

  return res.status(200).json({
    message: "List of Posts",
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  try {
    if (post.user == req.user.id) {
      let post = await Post.findById(req.params.id);
      post.remove();
      await Comment.deleteMany({ post: req.params.id });
      return res.status(200).json("Succesfully deleted the post");
    } else {
      return res.status(401).json({
        message: "Unauthorized to delete this post",
      });
    }
  } catch (err) {
    return res.status(500).json("Internal Error", err);
  }
};
