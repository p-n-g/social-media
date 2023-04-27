const {
  createPostController,
  likeOrDislikeController,
  updatePostController,
  deletePostController,
} = require("../controllers/postController");

const requireUser = require("../middlewares/requireUser");
const postRouter = require("express").Router();

postRouter.post("/", requireUser, createPostController);
postRouter.post("/like", requireUser, likeOrDislikeController);
postRouter.put("/", requireUser, updatePostController);
postRouter.delete("/", requireUser, deletePostController);

module.exports = postRouter;
