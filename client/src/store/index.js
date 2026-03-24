import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import storiesReducer from './slices/storiesSlice';
import profileReducer from './slices/profileSlice';

const createStore = (preloadedState) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      posts: postsReducer,
      stories: storiesReducer,
       profile: profileReducer,
    },
    preloadedState,
  });
};
export default createStore;

