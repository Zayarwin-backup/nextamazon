const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const getUser = async (req, res) => {
  try {
    // const user = await User.findOne({
    //   _id: req.params.id,
    // });

    const userData = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(
            req.params.id
          ),
        },
      },
      //TODO Instead of following serach at friends
      {
        $lookup: {
          from: "users",
          let: { user_id: "$friends" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$user_id"],
                },
              },
            },
          ],
          as: "friends",
        },
      },
    ]);

    const user = userData[0];
    if (!userData)
      return res
        .status(400)
        .json({ message: "User Doesn't exist." });

    res.status(200).json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

//TODO TO Change follow user to friend
//TODO When you want to modify with firend do in this

const followUser = async (req, res) => {
  try {
    const requestUser = await User.findOne({
      _id: req.user,
    });
    const responseUser = await User.findOne({
      _id: req.params.id,
    });

    if (
      !responseUser.friends.includes(req.user)
    ) {
      await requestUser.updateOne({
        $push: {
          friends: req.params.id,
        },
      });
      await responseUser.updateOne({
        $push: {
          friends: req.user,
        },
      });
    } else {
      return res.status(402).json({
        message:
          "You already friend with this user!!!",
      });
    }

    res
      .status(201)
      .json({ message: "You follow this user" });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};
//TODO TO change unfollow user to unfriend
const unfollowUser = async (req, res) => {
  try {
    const requestUser = await User.findOne({
      _id: req.user,
    });
    const responseUser = await User.findOne({
      _id: req.params.id,
    });

    if (responseUser.friends.includes(req.user)) {
      await responseUser.updateOne({
        $pull: { friends: req.user },
      });
      await requestUser.updateOne({
        $pull: { friends: req.params.id },
      });
    } else {
      return res.status(400).json({
        message:
          "You are not friend with this user.",
      });
    }

    res.status(201).json({
      message: "You unfollow this user.",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

module.exports = {
  getUser,
  getAllUsers,
  followUser,
  unfollowUser,
};
