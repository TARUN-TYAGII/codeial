const Post = require("../model/post");
const User = require("../model/user");

module.exports.home = async function (req, res) {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path: "comment",
      populate: {
        path: "user",
      },
      // populate: {
      //   path: "likes",
      // },
    })
    // .populate("comment")
    .populate("likes");
  // .exec(function (err, posts) {
  //console.log("POST", posts[0]);
  let users = await User.find({}).populate("friendships");
  return res.render("home", {
    title: "Home | Codeial",
    posts: posts,
    all_users: users,
  });
  //});
  // });
};
