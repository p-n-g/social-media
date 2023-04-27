

const ta = require("time-ago");

const mapPostOutput = (post, userId) => {
  
  return {
    _id: post._id,
    caption: post.caption,
    image: post.image,
    owner: {
        _id: post.owner._id,
        name: post.owner.name,
        avatar: post.owner.avatar,
    },
    likesCount: post.likes.length,
    isLiked: post.likes.map(like => like.toString()).includes(userId.toString()),
    timeAgo: ta.ago(post.createdAt),
  };
};

const mapFollowingOutput = (user, userId) => {
    return {
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        posts: user.posts.map(post => mapPostOutput(post, userId)).reverse(),
    }
};

const mapSuggestionOutput =(user) => {
    return {
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
    }
};


module.exports = {mapPostOutput, mapFollowingOutput, mapSuggestionOutput};
