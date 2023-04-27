import Post from "../post/Post";
import "./Profile.scss";
import userImg from "../../assets/images/user.png";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CreatePost from "../createPost/CreatePost";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUserProfile } from "../../redux/slices/postsSlice";
import { followOrUnfollow } from "../../redux/slices/feedSlice";

const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { userId } = params;
  const dispatch = useDispatch();

  const userProfile = useSelector((store) => store.postsReducer.userProfile);
  const myProfile = useSelector((store) => store.appConfigReducer.myProfile);
  const [isMyProfile, setIsMyProfile] = useState(false);

  useEffect(() => {
    dispatch(getUserProfile({ userId }));
    setIsMyProfile(myProfile._id === userId);
  }, [params.userId, myProfile, userId, dispatch]);

  function handleFollow() {
    try {
      dispatch(
        followOrUnfollow({
          userIdToFollow: userId,
        })
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="Profile">
      <div className="container">
        <div className="left-part">
          {isMyProfile ? <CreatePost src={myProfile?.avatar?.url} /> : ""}
          {userProfile?.posts?.map((post) => {
            return <Post parent="profile" key={post._id} {...post} />;
          })}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img
              className="user-img"
              src={userProfile?.avatar?.url || userImg}
              alt=""
            />
            <h3 className="user-name">{`${userProfile?.name}`}</h3>
            <div className="follow-info">
              <h4>{`${userProfile?.followers?.length}`} Followers</h4>
              <h4>{`${userProfile?.followings?.length}`} Followings</h4>
            </div>
            {isMyProfile ? (
              <button
                className="update-profile secondary-btn"
                onClick={() => navigate("/update-profile")}
              >
                Update Profile
              </button>
            ) : (
              <button
                className={
                  (userProfile?.doFollow ? "unfollow-btn" : "follow-btn") +
                  " btn"
                }
                onClick={handleFollow}
              >
                {userProfile?.doFollow ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
