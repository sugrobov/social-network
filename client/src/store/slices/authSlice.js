import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import storage from '../../services/storage';
import { updateProfile, uploadAvatar, followUser, unfollowUser } from './profileSlice';

// Вспомогательная функция сохранения данных (теперь асинхронная)
const saveAuthData = async (data) => {
  await storage.setItem('token', data.token);
  await storage.setItem('user', JSON.stringify(data.user));
  return data;
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return await saveAuthData(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return await saveAuthData(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      // Очищаем состояние синхронно, а хранилище асинхронно (но это не страшно)
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Удаляем из хранилища (асинхронно, не блокируем редьюсер)
      // подумать: использовать асинхронный thunk для logout ???
      storage.removeItem('token');
      storage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        // Обновляем пользователя в auth, если это тот же юзер
        if (state.user && state.user.id === action.payload.id) {
          state.user = { ...state.user, ...action.payload };
          // Сохраняем в хранилище
          storage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.user) {
          state.user.avatar = action.payload.avatar; // action.payload.avatar — полный URL
          storage.setItem('user', JSON.stringify(state.user));
        }
      })
      .addCase(followUser.fulfilled, (state, action) => {
        // Если текущий пользователь подписался на кого-то
        if (state.user && action.meta.arg !== state.user.id) {
          state.user.followingCount = action.payload.followingCount;
          // Обновляем массив following, если нужно (но мы его не храним в user, только счётчик)
          // Если хотим хранить, то можно добавить в user.following, но для простоты пока только счётчик
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.user && action.meta.arg !== state.user.id) {
          state.user.followingCount = action.payload.followingCount;
        }
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;