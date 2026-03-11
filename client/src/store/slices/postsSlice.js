// client/src/store/slices/postsSlice.js
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
      return response.data;
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
      return response.data;
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
      // Fetch posts
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
      
      // Create post 
      .addCase(createPost.fulfilled, (state, action) => {
        // Добавляем автора из текущего пользователя, если его нет
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const newPost = {
          ...action.payload,
          author: action.payload.author || {
            id: user.id || 1,
            firstName: user.firstName || 'Test',
            lastName: user.lastName || 'User',
            username: user.email?.split('@')[0] || 'testuser',
            avatar: '/default-avatar.png'
          },
          likes: action.payload.likes || [],
          comments: action.payload.comments || []
        };
        state.items.unshift(newPost);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.items.findIndex(post => post.id === action.payload.post.id);
        if (index !== -1) {
          state.items[index] = action.payload.post;
        }
      })
      
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const postIndex = state.items.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          if (!state.items[postIndex].comments) {
            state.items[postIndex].comments = [];
          }
          state.items[postIndex].comments.push(comment);
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;