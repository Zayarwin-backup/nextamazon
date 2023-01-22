const router = require("express").Router();
const Conversation = require("../models/Conversation");

router.post("/:id", async (req, res) => {
  const { senderId } = req.body;

  const receiverId = req.params.id;

  try {
    const conversation =
      await Conversation.create({
        members: [senderId, receiverId],
      });
    res.status(201).json(conversation);
  } catch (error) {
    if (error.code === 11000) {
      res.status(500).json({
        message:
          "You already add this friend to chatList.",
      });
    }
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const conversations = await Conversation.find(
      {
        members: { $in: [id] },
      }
    );

    res.status(200).json(conversations);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
});

module.exports = router;
