import { createSlice, createAsyncThunk, asyncThunkCreator } from '@reduxjs/toolkit';
import * as postAPI from '../api/postAPI';

const initialState = {
    post: null,
    loading: false,
    error: null

}

export const createPost = createAsyncThunk(
    'post/createPost',
    async (postData, { rejectWithValue }) => {
        try {
            const response = await postAPI.createPost(postData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'post failed');
        }
    }
)

export const updatePost = createAsyncThunk(
    'post/updatePost',
    async ({ id, postData }, { rejectWithValue }) => {
        try {
            const response = await authAPI.updatePost(id, postData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'post update failed');
        }
    }

)
export const deletePost = createAsyncThunk(
    'post/deletePost',
    async (id, { rejectWithValue }) => {
        try {
            const response = await authAPI.deletePost(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'post delete failed');
        }
    }
)

export const getPost = createAsyncThunk(
    'post/getPost',
    async (id, { rejectWithValue }) => {
        try {
            const response = await authAPI.getPost(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'get post failed');
        }
    }
)

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.loading = true;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.post = action.payload;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false;
                state.post = action.payload;
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                state.post = null;
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getPost.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.loading = false;
                state.post = action.payload;
            })
            .addCase(getPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }

})
export default postSlice.reducer;
export const { }= postSlice.actions