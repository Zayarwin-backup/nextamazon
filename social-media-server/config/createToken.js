const jwt = require("jsonwebtoken");

const createAccessToken = (id) => {
  const accessToken = jwt.sign(
    { id },
    process.env.ACCESSTOKENSECRET,
    { expiresIn: "30m" }
  );
  return accessToken;
};

const createRefreshToken = (id) => {
  const refreshToken = jwt.sign(
    { id },
    process.env.REFRESHTOKENSECRET,
    { expiresIn: "30d" }
  );
  return refreshToken;
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};
