
import {KEY_ACCESS_TOKEN ,getItem} from "../utils/localStorageManager";
import {Outlet, Navigate} from "react-router-dom";

function RequireUser(){
    const accessToken = getItem(KEY_ACCESS_TOKEN);
    return(
        accessToken ?<Outlet /> : <Navigate to="/login"/>
    );
}

export default RequireUser;