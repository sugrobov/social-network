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
        state.error = null; // Обновляем состояние error 
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
      .addCase(createStory.fulfilled, (state, action) => {
        const newStory = action.payload;
        const authorId = newStory.author.id;

        // Ищем существующие сторис автора
        const authorStoriesIndex = state.items.findIndex(item => item.author.id === authorId);

        if (authorStoriesIndex !== -1) {
          // Добавляем новую сторис в начало существующего автора
          state.items[authorStoriesIndex].stories.unshift(newStory);
        } else {
          // Создаем новую группу для автора
          state.items.unshift({
            author: newStory.author,
            stories: [newStory]
          });
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(viewStory.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(viewStory.fulfilled, (state, action) => { // обработка события просмотра сториса
        const { storyId, views } = action.payload;

        // Обновляем просмотры во всех сторис
        state.items.forEach(item => {
          const story = item.stories.find(story => story.id === storyId);
          if (story) {
            story.views = views;
          }

        })
      });
  },
});

export default storiesSlice.reducer;