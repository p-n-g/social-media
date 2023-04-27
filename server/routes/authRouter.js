const auth = require("express").Router();
const {signupController, loginController, refreshAccessTokenController, logoutController} = require("../controllers/authController");
const requireUser = require("../middlewares/requireUser");

auth.post("/signup", signupController);
auth.post("/login", loginController);
auth.get("/refresh", refreshAccessTokenController);
auth.get("/logout", requireUser, logoutController);

module.exports = auth;