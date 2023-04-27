const requireUser = require("../middlewares/requireUser");
const {
  followOrUnfollowController,
  getPostsOfFollowingsController,
  getMyPostController,
  getUserPosts,
  deleteProfileController,
  getMyInfoController,
  updateMyProfileController,
  getAUserProfile,
  getFeedController
} = require("../controllers/userController");
const userRouter = require("express").Router();

userRouter.post("/follow", requireUser, followOrUnfollowController);
userRouter.get("/followingsposts", requireUser, getPostsOfFollowingsController);
userRouter.get("/myposts", requireUser, getMyPostController);
userRouter.post("/userposts", requireUser, getUserPosts);
userRouter.delete("/", requireUser, deleteProfileController);
userRouter.get("/getMyInfo", requireUser, getMyInfoController);
userRouter.put("/", requireUser, updateMyProfileController);
userRouter.post("/getUserProfile", requireUser, getAUserProfile);
userRouter.get("/getFeed", requireUser, getFeedController);

module.exports = userRouter;
