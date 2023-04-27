const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { success, error } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.json(error(400, "please provide credentials"));
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.json(error(403, "email already registered"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  newUser.save();
  res.json(success(201, "account created successfully"));
};

const loginController = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.json(error(403, "please enter credentials"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.json(error(404, "email not registered"));
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return res.json(error(403, "invalid credentials"));
  }

  const accessToken = generateAccessToken({ _id: user._id });
  const refreshToken = generateRefreshToken({ _id: user._id });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
  });

  res.json(
    success(200, {
      message: "logged in successfully",
      accessToken,
    })
  );
};

const refreshAccessTokenController = async (req, res) => {
  
  if (!req.cookies?.jwt) {
    return res.json(error(401, "refresh token is required in cookie"));
  }
  const refreshToken = req.cookies.jwt;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    if(!decoded){
      return res.json(error(401, "invalid refresh token"));
    }
    const _id = decoded._id;
    const newAccessToken = generateAccessToken(
      { _id },
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      {
        expiresIn: "1d",
      }
    );
    res.json(success(201, {
      message: "access token generated successfully",
      accessToken: newAccessToken,
    }));
  } catch (e) {
    console.log(e.message);
    return res.json(error(401, "invalid refresh token"));
  }
};


const logoutController = (req, res) => {
  try{
    res.clearCookie("jwt",{
      httpOnly: true,
      secure: true,
    });
    return res.json(success(200, "logged out successfully"));
  }
  catch(e){
    return res.json(error(500, e.message));
  }
}


// internal function - r those which r not exported and used internally but the module
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (e) {
    console.log("unable to generate access token ", e.message);
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    console.log("refresh token generated");
    return token;
  } catch (e) {
    console.log("unable to generate refresh token ", e.message);
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController,
};
