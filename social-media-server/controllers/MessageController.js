const Message = require("../models/Message");
const mongoose = require("mongoose");

const getAllMessage = async (req, res) => {
  const { id } = req.params;
  const { receiver } = req.query;
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $and: [
            {
              users: { $eq: id },
            },
            {
              users: {
                $eq: receiver,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          let: { user_id: "$sender" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$user_id"],
                },
              },
            },
          ],
          as: "sender",
        },
      },
      {
        $unwind: "$sender",
      },
    ]);

    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const { messageData } = req.body;
    const message = await Message.create(
      messageData
    );

    res.status(201).json(message);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message });
  }
};

module.exports = { getAllMessage, createMessage };
