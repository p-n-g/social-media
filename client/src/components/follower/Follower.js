import Avatar from "../Avatar/Avatar";
import "./Follower.scss";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { followOrUnfollow } from "../../redux/slices/feedSlice";

const Follower = ({ _id, name, avatar, doFollow }) => {
  const dispatch = useDispatch();

  function handleFollow() {
    try {
      dispatch(
        followOrUnfollow({
          userIdToFollow: _id,
        })
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="Follower">
      <Link to={`/profile/${_id}`}>
        <div className="follower-info">
          <Avatar src={avatar?.url} />
          <h4 className="name">{name}</h4>
        </div>
      </Link>
      <div className="follow-unfollow-btn hover-link follow-link" onClick={handleFollow}>
        {doFollow ? <button className="unfollow-btn">Unfollow</button> : <button className="follow-btn">Follow</button>}
      </div>
    </div>
  );
};

export default Follower;
