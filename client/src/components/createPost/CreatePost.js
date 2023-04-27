import Avatar from "../Avatar/Avatar";
import "./CreatePost.scss";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsImage } from "react-icons/bs";
import axiosClient from "../../utils/axiosClient";
import { setLoading } from "../../redux/slices/appConfigSlice";
import { getUserProfile } from "../../redux/slices/postsSlice";

const CreatePost = ({ src }) => {
  const [postImg, setPostImg] = useState("");
  const [caption, setCaption] = useState("");

  const myProfile = useSelector((store) => store.appConfigReducer.myProfile);
  const dispatch = useDispatch();

  function handlePostImg(e) {
    try {
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        if (fileReader.readyState === fileReader.DONE) {
          setPostImg(fileReader.result);
        }
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleCreatePost(e) {
    try {
      e.preventDefault();
      if (!caption || !postImg) {
        dispatch(
          setToastData({
            type: "error_toast",
            message: "caption and post image are required",
          })
        );
        return;
      }
      dispatch(setLoading(true));
      const response = await axiosClient.post("/post", {
        caption,
        postImg,
      });
      dispatch(setToastData({
        type: "success_toast",
        message: "post uploaded successfully",
      }))
      dispatch(
        getUserProfile({
          userId: myProfile._id,
        })
      );
    } catch (error) {
      console.log(e.message);
    } finally {
      dispatch(setLoading(false));
      setCaption("");
      setPostImg("");
    }
  }

  return (
    <div className="CreatePost">
      <div className="create-post-left-part">
        <Avatar src={src} />
      </div>
      <div className="create-post-right-part">
        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            className="input-caption"
            placeholder="Enter a caption"
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          />
          {postImg && (
            <div className="img-container">
              <img src={postImg} alt="post-img" />
            </div>
          )}

          <div className="bottom-part">
            <label htmlFor="post-img" className="label-img hover-link">
              <BsImage />
            </label>
            <input
              type="file"
              className="input-post-img"
              id="post-img"
              accept="image/*"
              onChange={handlePostImg}
            />
            <input type="submit" className="submit primary-btn" value="Post" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
