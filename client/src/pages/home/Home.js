
import {Outlet} from "react-router-dom";
import { useEffect } from "react";
import {getMyInfo} from "../../redux/slices/appConfigSlice";
import {useDispatch} from "react-redux";

function Home() {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyInfo());
  }, [dispatch]);

  return (
      <div className="outlet" style={{marginTop: "60px"}}>
        <Outlet />
      </div>
  );
}

export default Home;
