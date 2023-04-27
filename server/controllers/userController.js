const User = require("../models/User");
const Post = require("../models/Post");
const { success, error } = require("../utils/responseWrapper");
const cloudinary = require("cloudinary");
const { mapPostOutput, mapFollowingOutput , mapSuggestionOutput } = require("../utils/Utils");

async function followOrUnfollowController(req, res) {
  try {
    const currUserId = req._id;
    const { userIdToFollow } = req.body;

    // 406 - not acceptable
    if (currUserId === userIdToFollow) {
      return res.json(error(409, "you cannot follow/unfollow yourself"));
    }

    const userToFollow = await User.findById(userIdToFollow).populate("posts");
    const currUser = await User.findById(currUserId);

    if (!userToFollow) {
      return res.json(error(404, "user to follow not found"));
    }

    if (currUser.followings.includes(userToFollow._id)) {
      // already followed
      const followingIndex = currUser.followings.indexOf(userIdToFollow);
      currUser.followings.splice(followingIndex, 1);
      await currUser.save();
      
      const followerIndex = userToFollow.followers.indexOf(currUserId);
      userToFollow.followers.splice(followerIndex, 1);
      await userToFollow.save();
      
      return res.json(success(200,  {...mapSuggestionOutput(userToFollow, currUserId), doFollow: false, followers: userToFollow.followers}));
    } else {
      // not followed
      currUser.followings.push(userIdToFollow);
      await currUser.save();
      
      userToFollow.followers.push(currUserId);
      await userToFollow.save();
      
      const doFollow = true;
      return res.json(success(200, {...mapFollowingOutput(userToFollow, currUserId), doFollow: true, followers: userToFollow.followers}));
    }
  } catch (e) {
    return res.json(error(500, e.message));
  }
}

async function getPostsOfFollowingsController(req, res) {
  const currUserId = req._id;

  const currUser = await User.findById(currUserId);

  const posts = await Post.find({
    owner: {
      $in: currUser.followings,
    },
  });

  res.json(
    success(200, {
      message: "followings posts fetched",
      posts,
    })
  );
}

async function getMyPostController(req, res) {
  try {
    const currUserId = req._id;

    const posts = await Post.find({
      owner: currUserId,
    }).populate("likes");

    return res.json(
      success(200, {
        message: "your posts",
        posts,
      })
    );
  } catch (w) {
    return res.json(error(500, e.message));
  }
}

async function getUserPosts(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.json(error(400, "user id is required"));
    }

    const posts = await Post.find({
      owner: userId,
    }).populate("likes");

    return res.json(
      success(200, {
        message: "users posts",
        posts,
      })
    );
  } catch (e) {
    return res.json(error(500, e.message));
  }
}

async function deleteProfileController(req, res) {
  try {
    const currUserId = req._id;
    const currUser = await User.findById(currUserId);

    // remove all posts
    await Post.deleteMany({
      owner: currUserId,
    });

    // remove him from followings followers list,
    currUser.followings.forEach(async (followingId) => {
      const following = await User.findById(followingId);
      const index = following.followers.indexOf(currUser._id);
      following.followers.splice(index, 1);
      await following.save();
    });

    // remove him from followers followings list,
    currUser.followers.forEach(async (followerId) => {
      const follower = await User.findById(followerId);
      const index = follower.followings.indexOf(currUserId);
      follower.followings.splice(index, 1);
      await follower.save();
    });

    // remove all his likes,
    const allPosts = await Post.find();
    allPosts.forEach(async (post) => {
      const index = post.likes.indexOf(currUserId);
      post.likes.splice(index, 1);
      await post.save();
    });

    await User.findByIdAndDelete(currUserId);

    // delete cookie and logout
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });

    res.json(success(200, "user was deleted"));
  } catch (e) {
    res.json(error(500, e.message));
  }
}

async function getMyInfoController(req, res) {
  try {
    const currUserId = req._id;
    const currUser = await User.findById(currUserId);
    return res.json(
      success(200, {
        message: "your info",
        user: currUser,
      })
    );
  } catch (e) {
    return res.json(error(500, e.message));
  }
}

async function updateMyProfileController(req, res) {
  try {
    const currUserId = req._id;
    const { name, bio, userImg } = req.body;

    const currUser = await User.findById(currUserId);

    if (name) {
      currUser.name = name;
    }
    if (bio) {
      currUser.bio = bio;
    }
    if (userImg) {
      const cloudImg = await cloudinary.v2.uploader.upload(userImg, {
        folder: "profileImg",
      });
      currUser.avatar = {
        url: cloudImg.secure_url,
        publicId: cloudImg.publicId,
      };
    }
    await currUser.save();
    return res.json(
      success(200, {
        message: "user updated successfully",
        user: currUser,
      })
    );
  } catch (e) {
    console.log(e);
    return res.json(error(500, e.message));
  }
}

async function getAUserProfile(req, res) {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId).populate({
      path: "posts", // means user's posts property
      populate: {
        path: "owner",
      },
    });
    if (!user) {
      return res.json(error(404, "user not found"));
    }
    const doFollow = user.followers.includes(req._id);

    return res.json(
      success(200, {
        message: "user profile",
        profile: {
          ...user._doc,
          posts: user.posts
            .map((post) => mapPostOutput(post, req._id))
            .reverse(),
          doFollow,
        },
      })
    );
  } catch (e) {
    return res.json(error(500, e.message));
  }
}

async function getFeedController(req, res) {
  const currUserId = req._id;
  const currUser = await User.findById(currUserId).populate({
    path: "followings",
    populate: {
      path: "posts",
    },
  });

  const followingsId = currUser.followings.map((following) => following._id);
  
  const followings = currUser.followings.map((following) =>
    mapFollowingOutput(following, currUserId)
  );

  const fullSuggestions = await User.find({
    _id: {
      $nin: followings,
      $ne: currUser._id,
    }
  });
  const suggestions = fullSuggestions.map(suggestion => mapSuggestionOutput(suggestion));

  res.json(success(200, { followings, suggestions }));
}

module.exports = {
  followOrUnfollowController,
  getPostsOfFollowingsController,
  getMyPostController,
  getUserPosts,
  deleteProfileController,
  getMyInfoController,
  updateMyProfileController,
  getAUserProfile,
  getFeedController,
};
