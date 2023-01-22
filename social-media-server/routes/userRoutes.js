const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.get(
  "/getallusers",
  userController.getAllUsers
);

router.get("/:id", userController.getUser);

router.put(
  "/:id/follow",
  auth.checkUserLogin,
  userController.followUser
);

router.put(
  "/:id/unfollow",
  auth.checkUserLogin,
  userController.unfollowUser
);

module.exports = router;
