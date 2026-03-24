import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postsService } from '../../services/postsService';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postsService.getPosts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postsService.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postsService.likePost(postId);
      return response.data; // { post }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await postsService.addComment(postId, content);
      return response.data; // { postId, comment }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const updatedPost = action.payload.post;
        const index = state.items.findIndex(p => p.id === updatedPost.id);
        if (index !== -1) {
          state.items[index] = updatedPost;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.items.find(p => p.id === postId);
        if (post) {
          if (!post.comments) post.comments = [];
          post.comments.push(comment);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;