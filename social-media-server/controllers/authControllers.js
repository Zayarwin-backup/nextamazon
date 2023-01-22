const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  createAccessToken,
  createRefreshToken,
} = require("../config/createToken");
const User = require("../models/User");

//create user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //checking for input
    if (!name || !email || !password)
      return res.status(400).json({
        message: "All input fields are required.",
      });
    //creating hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(
      password,
      salt
    );
    //create user
    const user = await User.create({
      name,
      email,
      password: hashpassword,
    });

    const accessToken = createAccessToken(
      user._id
    );

    res.status(201).json({
      user,
      accessToken,
      message: "Thank for joining.",
    });
  } catch (err) {
    let error;
    if (err.code === 11000) {
      error =
        Object.values(err.keyValue)[0] +
        " is already exist.";
    }
    res.status(500).json({ message: error });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "Email not Found!!!" });

    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!checkPassword)
      return res
        .status(400)
        .json({ message: "Incorrect Password." });

    const accessToken = createAccessToken(
      user._id
    );

    const refreshToken = createRefreshToken(
      user._id
    );

    res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: `/api/auth/refreshtoken`,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        user,
        accessToken,
        message: "Login Success.",
      });
  } catch (err) {
    res.status(500).json({ messge: err.message });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      path: `/api/auth/refreshtoken`,
    });

    res
      .status(200)
      .json({ message: "Logout successful!!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(400).json({
        message: "Something went wrong",
      });

    const { id } = jwt.verify(
      token,
      process.env.REFRESHTOKENSECRET
    );

    const user = await User.findById(id);
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found" });

    const accessToken = createAccessToken(
      user._id
    );
    res.status(200).json({ user, accessToken });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
};
