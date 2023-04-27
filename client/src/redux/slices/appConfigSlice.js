
import {createAsyncThunk, createSlice}  from "@reduxjs/toolkit";
import axiosClient from "../../utils/axiosClient";

export const getMyInfo = createAsyncThunk("user/getMyInfo", async () => {
    try{
        const response = await axiosClient.get("/user/getMyInfo");
        return response.result;
    } catch(error) {
        return Promise.reject(error);
    }
});

export const updateMyProfile = createAsyncThunk("/user/updateMyProfile", async(body, thunkAPI) => {
    try{
        const response = await axiosClient.put("user/", body);
        return response.result;
    }  catch(e){
    } finally{
        thunkAPI.dispatch(setToastData({
            type: "success_toast",
            message: "profile updated successfully",
        }));
    }
});

export const createPost = createAsyncThunk("user/createPost", async(body) => {
    try{
        const response = await axiosClient.post("/post", body);
        return response.result;
    } catch(error){
        return Promise.reject(error);
    }
});

const appConfigSlice = createSlice({
    name: "appConfigSlice",
    initialState: {
        isLoading: false,
        toastData: {},
        myProfile: {},
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setToastData: (state, action) => {
            state.toastData = action.payload;
        },
        clearAppConfigSLice: (state) => {
            state.isLoading= false;
            state.myProfile= {};
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMyInfo.fulfilled, (state, action) => {
            state.myProfile = action.payload?.user;
        })
        .addCase(updateMyProfile.fulfilled, (state, action) => {
            state.myProfile = action.payload?.user;
        })
    }
});

export default appConfigSlice.reducer;
export const {setLoading, clearAppConfigSLice, setToastData} = appConfigSlice.actions;