import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storiesService } from '../../services/storiesService';

export const fetchStories = createAsyncThunk(
  'stories/fetchStories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storiesService.getFeedStories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createStory = createAsyncThunk(
  'stories/createStory',
  async (storyData, { rejectWithValue }) => {
    try {
      const response = await storiesService.createStory(storyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const storiesSlice = createSlice({
  name: 'stories',
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
      .addCase(fetchStories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        // Добавляем новую сторис в начало соответствующего автора
        const authorId = action.payload.author.id;
        const authorStories = state.items.find(item => item.author.id === authorId);
        
        if (authorStories) {
          authorStories.stories.unshift(action.payload);
        } else {
          state.items.unshift({
            author: action.payload.author,
            stories: [action.payload]
          });
        }
      });
  },
});

export const { clearError } = storiesSlice.actions;
export default storiesSlice.reducer;