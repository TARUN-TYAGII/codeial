const Post = require("../model/post");
const Comment = require("../model/comment");
const Like = require("../model/like");

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if (req.xhr) {
      return res.status(200).json({
        data: {
          post: post,
        },
        message: "Post Created!!",
      });
    } else {
      req.flash("error", "Cannot create the post");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      await Like.deleteMany({ likeable: post, onModel: "Post" });
      await Like.deleteMany({ _id: { $in: post.Comment } }); // what is this line?

      post.remove();

      await Comment.deleteMany({ post: req.params.id });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post deleted ",
        });
      }
      req.flash("success", "Successfully deleted the post");
      return res.redirect("back");
    } else {
      req.flash("error", "You cannot delete this post");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};
