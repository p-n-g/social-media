
import { Outlet } from "react-router-dom"
import { KEY_ACCESS_TOKEN, getItem } from "../utils/localStorageManager"
import {Navigate} from "react-router-dom";

const UnauthorizedUser = () => {
    
    return (
        getItem(KEY_ACCESS_TOKEN) ? <Navigate to="/" /> : <Outlet />
    );
}

export default UnauthorizedUser;