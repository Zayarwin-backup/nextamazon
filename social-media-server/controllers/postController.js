const { default: mongoose } = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json({ post });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          let: { user_id: "$user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$user_id"],
                },
              },
            },
            {
              $project: { password: 0 },
            },
          ],
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "users",
          let: { user_id: "$like" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$user_id"],
                },
              },
            },
          ],
          as: "like",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { comment_id: "$comment" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$comment_id"],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                let: { user_id: "$user" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: [
                          "$_id",
                          "$$user_id",
                        ],
                      },
                    },
                  },
                ],
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ],
          as: "comment",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({ posts });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(
            req.params.id
          ),
        },
      },
      {
        $lookup: {
          from: "users",
          let: { user_id: "$user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$user_id"],
                },
              },
            },
            {
              $project: { password: 0 },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "users",
          let: { user_id: "$like" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$user_id"],
                },
              },
            },
          ],
          as: "like",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { comment_id: "$comment" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$comment_id"],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                let: { user_id: "$user" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: [
                          "$_id",
                          "$$user_id",
                        ],
                      },
                    },
                  },
                ],
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ],
          as: "comment",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json(posts);
    console.log("hit");
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
    });
    if (!post)
      return res.status(400).json({
        message: "You cant like unaviable Post.",
      });

    if (!post.like.includes(req.user)) {
      await post.updateOne({
        $push: { like: req.user },
      });
    } else {
      await post.updateOne({
        $pull: { like: req.user },
      });
    }

    res
      .status(201)
      .json({ message: "You like this post" });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const user_id = req.user;
    if (!user_id)
      return res.status(400).json({
        message: "Please comment to Login.",
      });
    const user = await User.findOne({
      _id: user_id,
    });

    const comment = await Comment.create({
      user: user_id,
      ...req.body,
    });

    const post = await Post.findOne({
      _id: req.params.id,
    });
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found." });

    await post.updateOne({
      $push: { comment: comment._id },
    });

    res
      .status(201)
      .json({ message: "Comment Success." });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostsByUser,
  likePost,
  commentPost,
};
