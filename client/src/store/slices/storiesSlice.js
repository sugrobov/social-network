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

export const viewStory = createAsyncThunk(
  'stories/viewStory',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await storiesService.viewStory(storyId);
      return { storyId, views: response.data.views };
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
      .addCase(createStory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(viewStory.rejected, (state, action) => {
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
        state.loading = false;  // Обновляем состояние loading после создания сториса
      })
      .addCase(viewStory.fulfilled, (state, action) => { // обработка события просмотра сториса
        for (const item of state.items) {
          const story = item.stories.find(story => story.id === action.payload.storyId);
          if (story) {
            story.views = action.payload.views;
            break; // выход из цикла после обновления просмотра
          }
        }
      })
  },
});

export default storiesSlice.reducer;