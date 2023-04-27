import "./Header.scss";
import { Link } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import { AiOutlineLogout } from "react-icons/ai";
import { useSelector } from "react-redux";

function Header() {
  const myProfile = useSelector((store) => store.appConfigReducer.myProfile);

  return (
    <div className="Header">
      <div className="container">
        <h2 className="logo hover-link">
          <Link to="/">Social Media</Link>
        </h2>
        <div className="nav-bar">
          <ul className="navigators">
            {myProfile?._id ? (
              <li className="profile hover-link">
                <Link to={`/profile/${myProfile?._id}`}>
                  <Avatar src={myProfile?.avatar?.url} />
                </Link>
              </li>
            ) : (
              ""
            )}
            <li className="hover-link">
              <Link to="/">Home</Link>
            </li>
            <li className="hover-link">
              <Link to="/">About</Link>
            </li>
            <li className="hover-link">
              <Link to="/">Contact</Link>
            </li>
            {myProfile?._id ? (
              <li>
                <Link to="/logout">
                  <div className="logout hover-link">
                    <AiOutlineLogout />
                  </div>
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
