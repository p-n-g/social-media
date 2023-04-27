import axios from "axios";
import {
  KEY_ACCESS_TOKEN,
  getItem,
  removeItem,
  setItem,
} from "../utils/localStorageManager";

import store from "../redux/store";
import { setLoading, setToastData } from "../redux/slices/appConfigSlice";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  store.dispatch(setLoading(true));
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  return request;
});

axiosClient.interceptors.response.use(
  async (response) => {
    store.dispatch(setLoading(false));
    const data = response.data;

    if(data.statusCode === 200 && data.result === "user was deleted"){
      removeItem(KEY_ACCESS_TOKEN);
        window.location.replace("/login", "_self");
        return Promise.reject(data);
    }

    if (data.status === "ok") {
      return data;
    }

    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const error = data.error;

    store.dispatch(
      setToastData({
        type: "error_toast",
        message: error,
      })
    );

    if (statusCode === 401) {
      //  checking if the error is due to invalidity of refresh token ?
      if (
        error === "invalid refresh token" ||
        error === "refresh token is required in cookie"
      ) {
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace("/login", "_self");
        return Promise.reject(data);
      }

      // access token expired => hence refresh access token
      const response = await axiosClient.get("/auth/refresh");

      if (response.status === "ok") {
        const newAccessToken = response.result.accessToken;
        setItem(KEY_ACCESS_TOKEN, newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return (await axios(originalRequest)).data;
      } else {
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace("/login", "_self");
        return Promise.reject(data);
      }
    }
    return Promise.reject(data);
  },
  async (error) => {
    store.dispatch(setLoading(false));
    // errors like n/w error r encorporated here
    store.dispatch(
      setToastData({
        type: "error_toast",
        message: error.message,
      })
    );
  }
);

export default axiosClient;
