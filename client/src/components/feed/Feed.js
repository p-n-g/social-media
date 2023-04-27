import "./Feed.scss";
import Post from "../post/Post";
import Follower from "../follower/Follower";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed } from "../../redux/slices/feedSlice";

const Feed = () => {

  const feeds = useSelector(store => store.feedReducer.feeds);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeed());
  }, []);

  return (
    <div className="Feed">
      <div className="container">
        <div className="left-part">
          {feeds?.followings?.map(followings => {
            return followings.posts.map(post => <Post parent="feed" key={post._id} {...post} owner={{name: followings.name, avatar: followings.avatar, _id: followings._id}}/>);
          })}
        </div>
        <div className="right-part">
          <div className="followings">
            <h3 className="title">You are following</h3>
            <div className="followings-list">
              {feeds?.followings?.map(following => <Follower key={following._id} _id={following._id} avatar={following.avatar} name={following.name} doFollow={true}/>)}
            </div>
          </div>
          <div className="suggestions">
            <h3 className="title">Suggestions to follow</h3>
            <div className="suggestions-list">
            
            {feeds?.suggestions?.map(suggestion => <Follower key={suggestion._id} _id={suggestion._id} avatar={suggestion.avatar} name={suggestion.name} doFollow={false} />)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
