const router = require("express").Router();
const MessageController = require("../controllers/MessageController");

router.get(
  "/:id",
  MessageController.getAllMessage
);

router.post("/", MessageController.createMessage);

module.exports = router;
