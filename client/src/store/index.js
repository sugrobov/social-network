import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import storiesReducer from './slices/storiesSlice';

const createStore = (preloadedState) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      posts: postsReducer,
      stories: storiesReducer,
    },
    preloadedState,
  });
};
export default createStore;

