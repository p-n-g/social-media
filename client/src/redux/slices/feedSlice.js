import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";
import { likeOrDislikePost } from "./postsSlice";

export const fetchFeed = createAsyncThunk(
  "user/fetchFeed",
  async (body) => {
    try {
      const response = await axiosClient.get("user/getFeed");
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export const followOrUnfollow = createAsyncThunk(
  "user/followOrUnfollow",
  async (body) => {
    try {
      const response = await axiosClient.post("user/follow", body);
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);
const feedSlice = createSlice({
  name: "feedSlice",
  initialState: {
    feeds: [],
  },
  reducers: {
    clearFeedSLice: (state) => {
      state.feeds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feeds = action.payload;
      })
      .addCase(likeOrDislikePost.fulfilled, (state, action) => {
        const postOwnerIndex = state.feeds?.followings?.findIndex(
          (following) => following?._id === action.payload?.owner?._id
        );
        const feedPostIndex = state.feeds?.followings?.[
          postOwnerIndex
        ]?.posts?.findIndex((post) => post?._id === action.payload?._id);
        if (feedPostIndex !== undefined && feedPostIndex !== -1) {
          state.feeds?.followings?.[postOwnerIndex]?.posts.splice(
            feedPostIndex,
            1,
            action.payload
          );
        } // else - EITHER OF INDEXES is -1 or undedind
      })
      .addCase(followOrUnfollow.fulfilled, (state, action) => {
        const index = state.feeds?.followings?.findIndex(
          (following) => following._id === action.payload._id
        );
        if (index !== undefined && index !== -1) {
          state.feeds.followings.splice(index, 1);
          state.feeds.suggestions.push(action.payload);
        } else {
          const index2 = state.feeds?.suggestions?.findIndex(
            (suggestion) => suggestion?._id === action.payload?._id
          );
          state.feeds?.suggestions?.splice(index2, 1);
          state.feeds?.followings?.push(action.payload);
        }
      });
  },
});

export default feedSlice.reducer;
export const { clearFeedSLice } = feedSlice.actions;
