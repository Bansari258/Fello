import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchFeedPosts = createAsyncThunk(
    'posts/fetchFeed',
    async ({ page = 1 }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/posts?page=${page}&limit=10`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const fetchDiscoverPosts = createAsyncThunk(
    'posts/fetchDiscover',
    async ({ page = 1, sort = 'recent' }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/posts/discover?page=${page}&limit=10&sort=${sort}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const createPost = createAsyncThunk(
    'posts/create',
    async (postData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/posts', postData);
            return data.data.post;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const toggleLike = createAsyncThunk(
    'posts/toggleLike',
    async (postId, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/posts/${postId}/like`);
            return { postId, isLiked: data.data.isLiked };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const addComment = createAsyncThunk(
    'posts/addComment',
    async ({ postId, content }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/posts/${postId}/comment`, { content });
            return { postId, comment: data.data.comment };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deletePost = createAsyncThunk(
    'posts/delete',
    async (postId, { rejectWithValue }) => {
        try {
            await api.delete(`/posts/${postId}`);
            return postId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const postSlice = createSlice({
    name: 'posts',
    initialState: {
        feedPosts: [],
        discoverPosts: [],
        loading: false,
        error: null,
        hasMore: true,
        page: 1
    },
    reducers: {
        clearPosts: (state) => {
            state.feedPosts = [];
            state.discoverPosts = [];
            state.page = 1;
            state.hasMore = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeedPosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFeedPosts.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.feedPosts = action.payload.posts;
                } else {
                    state.feedPosts.push(...action.payload.posts);
                }
                state.hasMore = action.payload.posts.length > 0;
                state.page = action.meta.arg.page;
            })
            .addCase(fetchFeedPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchDiscoverPosts.fulfilled, (state, action) => {
                if (action.meta.arg.page === 1) {
                    state.discoverPosts = action.payload.posts;
                } else {
                    state.discoverPosts.push(...action.payload.posts);
                }
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.feedPosts.unshift(action.payload);
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                const { postId, isLiked } = action.payload;
                [state.feedPosts, state.discoverPosts].forEach(posts => {
                    const post = posts.find(p => p._id === postId);
                    if (post) {
                        post.isLiked = isLiked;
                        post.likesCount += isLiked ? 1 : -1;
                    }
                });
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const { postId } = action.payload;
                [state.feedPosts, state.discoverPosts].forEach(posts => {
                    const post = posts.find(p => p._id === postId);
                    if (post) {
                        post.commentsCount += 1;
                    }
                });
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.feedPosts = state.feedPosts.filter(p => p._id !== action.payload);
                state.discoverPosts = state.discoverPosts.filter(p => p._id !== action.payload);
            });
    }
});

export const { clearPosts } = postSlice.actions;
export default postSlice.reducer;