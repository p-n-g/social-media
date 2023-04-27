
import {configureStore} from "@reduxjs/toolkit";
import appConfigReducer from "./slices/appConfigSlice";
import postsReducer from "./slices/postsSlice";
import feedReducer from "./slices/feedSlice";

const store = configureStore({
    reducer: {
        appConfigReducer,
        postsReducer,
        feedReducer,
    }
});


export default store;