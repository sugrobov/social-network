import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load profile');
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'profile/fetchUserPosts',
  async (userId, { rejectWithValue }) => {
    try {
      // Используем новый эндпоинт
      const response = await api.get(`/users/${userId}/posts`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load posts');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'profile/uploadAvatar',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data; // возвращаем объект
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload avatar');
    }
  }
);

export const deleteUserPost = createAsyncThunk(
  'profile/deleteUserPost',
  async (postId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/posts/${postId}`);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

export const followUser = createAsyncThunk(
  'profile/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/${userId}/follow`);
      return response.data; // { following, followersCount, followingCount }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow');
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'profile/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/${userId}/unfollow`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow');
    }
  }
);

export const fetchFollowers = createAsyncThunk(
  'profile/fetchFollowers',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}/followers`);
      return response.data.followers;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch followers');
    }
  }
);

export const fetchFollowing = createAsyncThunk(
  'profile/fetchFollowing',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}/following`);
      return response.data.following;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch following');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    posts: [],
    loading: false,
    error: null,
    followersList: [],
    followingList: [],
    followersLoading: false,
    followingLoading: false,
  },
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.posts = [];
      state.error = null;
      state.followersList = [];
      state.followingList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        // Обновляем счётчик постов в профиле, если есть
        if (state.profile) {
          state.profile.postsCount = action.payload.length;
        }
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Upload avatar
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.avatar = action.payload.avatar;
        }
      })
      // Delete post
      .addCase(deleteUserPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
        if (state.profile) {
          state.profile.postsCount = state.posts.length;
        }
      })
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.profile && state.profile.id === action.meta.arg) {
          // Если мы подписались на пользователя, чей профиль открыт
          state.profile.isFollowing = action.payload.following;
          state.profile.followersCount = action.payload.followersCount;
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.profile && state.profile.id === action.meta.arg) {
          state.profile.isFollowing = action.payload.following;
          state.profile.followersCount = action.payload.followersCount;
        }
      })
      .addCase(fetchFollowers.pending, (state) => {
        state.followersLoading = true;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followersLoading = false;
        state.followersList = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state) => {
        state.followersLoading = false;
      })
      .addCase(fetchFollowing.pending, (state) => {
        state.followingLoading = true;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.followingLoading = false;
        state.followingList = action.payload;
      })
      .addCase(fetchFollowing.rejected, (state) => {
        state.followingLoading = false;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;