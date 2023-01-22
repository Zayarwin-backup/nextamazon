const router = require("express").Router();
const authControllers = require("../controllers/authControllers");

router.post(
  "/register",
  authControllers.register
);

router.post("/login", authControllers.login);

router.post("/logout", authControllers.logout);

router.get(
  "/refreshtoken",
  authControllers.refreshToken
);

module.exports = router;
