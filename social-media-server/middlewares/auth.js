const jwt = require("jsonwebtoken");

const checkUserLogin = (req, res, next) => {
  const authorization = req.headers.authorization;

  const token = authorization.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESSTOKENSECRET,
    (err, decoded) => {
      if (err) console.log(err);
      req.user = decoded.id;
      next();
    }
  );
};

module.exports = { checkUserLogin };
