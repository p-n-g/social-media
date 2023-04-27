

import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";
import { followOrUnfollow } from "./feedSlice";

export const likeOrDislikePost = createAsyncThunk("/post/likeOrDislikePost", async(body) => {
    try{
        const response = await axiosClient.post("post/like", body);
        return response.result.post;
    } catch(error){
        return Promise.reject(error);
    }
});

export const getUserProfile = createAsyncThunk("user/getUserProfile", async(body) => {
    try {
        const response = await axiosClient.post("user/getUserProfile", body);
        return response.result;
    } catch(error){
        return Promise.reject(error);
    }
});


const postsSlice = createSlice({
    name: "postsSlice",
    initialState: {
        userProfile: {},
    },
    reducers: {
        clearPostsSLice: (state) => {
            state.userProfile= {};
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserProfile.fulfilled, (state, action) => {
            state.userProfile = action.payload.profile;
        })
        .addCase(likeOrDislikePost.fulfilled, (state, action) => {
            const index = state.userProfile?.posts?.findIndex(post => post?._id === action.payload?._id);
            state.userProfile?.posts?.splice(index, 1, action.payload);
        })
        .addCase(followOrUnfollow.fulfilled, (state, action) => {
            state.userProfile.doFollow = action.payload?.doFollow;
            state.userProfile.followers = action.payload?.followers;
        });
    }
});

export default postsSlice.reducer;

export const {clearPostsSLice} = postsSlice.actions;

