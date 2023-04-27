
import userImg from "../../assets/images/user.png";
import "./Avatar.scss";
const Avatar = ({src}) => {
    return(
        <div className="Avatar">
            <img src={src ? src : userImg} alt="" />
        </div>
    );
}

export default Avatar;