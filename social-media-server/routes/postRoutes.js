const router = require("express").Router();
const postController = require("../controllers/postController");
const auth = require("../middlewares/auth");

router.post(
  "/createpost",
  postController.createPost
);

router.get("/getposts", postController.getPosts);

router.get(
  "/user/:id",
  postController.getPostsByUser
);

router.put(
  "/:id/like",
  auth.checkUserLogin,
  postController.likePost
);

router.put(
  "/:id/comment",
  auth.checkUserLogin,
  postController.commentPost
);

module.exports = router;
