const { success, error } = require("../utils/responseWrapper");
const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary");
const { mapPostOutput } = require("../utils/Utils");

const createPostController = async (req, res) => {
  try {
    const { caption, postImg } = req.body;
    const owner = req._id;

    if(!caption || !postImg){
      return res.json(error(404), "caption or image is required");
    }

    const cloudImg = await cloudinary.v2.uploader.upload(postImg, {
      folder: "postImg",
    });

    const post = await Post.create({
      owner,
      caption,
      image: {
        publicId: cloudImg.public_id,
        url: cloudImg.url,
      }
    });

    const user = await User.findOne({
      _id: owner,
    });

    user.posts.push(post._id);
    await user.save();

    return res.json(success(201, {
      message: "your newly created post",
      yourPost: post,
    }));
  } catch (err) {
    return res.json(error(500, err.message));
  }
};

async function likeOrDislikeController(req, res) {
  try {
    const { postId } = req.body;
    const currUserId = req._id;

    const post = await Post.findById(postId).populate("owner");

    if (!post) {
      return res.json(error(404, "post not found"));
    }
    if (post.likes.includes(currUserId)) {
      const index = post.likes.indexOf(currUserId);
      post.likes.splice(index, 1);
    } else {
      post.likes.push(currUserId);
    }

    await post.save();
    return res.json(success(200, {post: mapPostOutput(post, currUserId)}));

  } catch (e) {
    return res.json(error(500, e.message));
  }
}

async function updatePostController(req, res) {
  try {
    const currUserId = req._id;

    const { postId, captionToUpdate } = req.body;

    if(!captionToUpdate){
        return res.json(error(400, "caption is required"));
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.json(error(404, "post not found"));
    }

    // 403 - forbidden
    if (post.owner.toString() !== currUserId) {
      return res.json(error(403, "only owners can update their own posts"));
    }

    if (captionToUpdate) {
      post.caption = captionToUpdate;
    }

    await post.save();
    return res.json(success(200, "caption updated successfully"));
  } catch (e) {
    return res.json(error(500, e.message));
  }
}

async function deletePostController(req, res) {
  try {
    const currUserId = req._id;
    const { postId } = req.body;

    const post = await Post.findById(postId);
    const currUser = await User.findById(currUserId);

    if (!post) {
      return res.json(error(404, "post not found"));
    }
    if (post.owner.toString() != currUserId) {
      return res.json(error(400, "only owner can delete the post"));
    }

    const userPostIndex = currUser.posts.indexOf(post._id);
    currUser.posts.splice(userPostIndex, 1);
    await currUser.save();

    await Post.findByIdAndDelete(postId);

    return res.json(success(200, "post deleted succeessfully"));
  } catch (e) {
    return res.json(error(500, e.message));
  }
}

module.exports = {
  createPostController,
  likeOrDislikeController,
  updatePostController,
  deletePostController,
};
