import userDefaultImg from "../../assets/images/user.png";
import "./UpdateProfile.scss";
import {useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import {useState, useEffect} from "react";
import { updateMyProfile } from "../../redux/slices/appConfigSlice";
import axiosClient from "../../utils/axiosClient";

const UpdateProfile = () => {

  const myProfile = useSelector(store => store.appConfigReducer.myProfile);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [userImg, setUserImg] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setName(myProfile?.name || "");
    setBio(myProfile?.bio || "");
    setUserImg(myProfile?.avatar?.url || userDefaultImg);
  }, [myProfile]);

  function handleImgChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file); // async function
    fileReader.onload = () => {
      if(fileReader.readyState === fileReader.DONE){
        setUserImg(fileReader.result);
      }
    }
  }

  function handleUpdate(e){
    e.preventDefault();
    dispatch(updateMyProfile({
      name,
      bio,
      userImg,
    }));
  }

  async function handleDelete() {
    const response = await axiosClient.delete("/user/");
  }

  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <label htmlFor="input-user-img" className="user-img" ><img src={userImg} alt="user-img" /></label>
          <input className="input-user-img" id="input-user-img" type="file" accept="image/*" onChange={handleImgChange}/>
        </div>
        <div className="right-part">
          <form onSubmit={handleUpdate}>
            <input type="text" className="name" placeholder={`${name}`} onChange={(e) => setName(e.target.value)}/>
            <input type="text" className="bio" placeholder={`${bio}`} onChange={(e) => setBio(e.target.value)}/>

            <input className="update-profile primary-btn" type="submit" value="Update Profile"/>
          </form>
          <input className="delete-profile hover-link" type="submit" value="Delete Profile" onClick={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;