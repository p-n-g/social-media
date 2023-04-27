import { useDispatch } from "react-redux";
import { getItem, KEY_ACCESS_TOKEN, removeItem } from "../utils/localStorageManager";
import {clearAppConfigSLice} from "../redux/slices/appConfigSlice";
import {clearPostsSLice} from "../redux/slices/postsSlice";
import {clearFeedSLice} from "../redux/slices/feedSlice";


const Logout = () => {
    const dispatch = useDispatch();
    const accessToken = getItem(KEY_ACCESS_TOKEN);

    if(accessToken){
        dispatch(clearAppConfigSLice());
        dispatch(clearPostsSLice());
        dispatch(clearFeedSLice());
        
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace("/login", "_self");
    }
}

export default Logout;