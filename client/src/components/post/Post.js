import Avatar from "../Avatar/Avatar";
import "./Post.scss";
import { AiOutlineHeart } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { likeOrDislikePost } from "../../redux/slices/postsSlice";
import { useNavigate } from "react-router-dom";

const Post = ({
  _id,
  caption,
  image,
  owner,
  likesCount,
  timeAgo,
  isLiked,
  parent,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLike() {
    try {
      dispatch(
        likeOrDislikePost({
          postId: _id,
        })
      );
    } catch (error) {
      console.log("error while like or dislike: ", error);
    }
  }

  return (
    <div className="Post">
      <div className="heading" onClick={() => navigate(`/profile/${owner._id}`)}>
        <Avatar src={owner?.avatar?.url} />
        <h4>{owner?.name}</h4>
      </div>
      <div className="content">
        <img src={image?.url} alt="content image" />
      </div>
      <div className="footer">
        <div className="likes hover-link" onClick={handleLike}>
          {isLiked ? (
            <FcLike className="icon" />
          ) : (
            <AiOutlineHeart className="icon" />
          )}
          <h4>{likesCount} likes</h4>
        </div>
        <p className="caption">{caption}</p>
        <h4 className="time-ago">{timeAgo}</h4>
      </div>
    </div>
  );
};

export default Post;
