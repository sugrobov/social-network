import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storyService } from '../../services/storyService'; // исправлено

export const fetchStories = createAsyncThunk(
  'stories/fetchStories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storyService.getFeedStories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stories');
    }
  }
);

export const createStory = createAsyncThunk(
  'stories/createStory',
  async (storyData, { rejectWithValue }) => {
    try {
      const response = await storyService.createStory(storyData); // исправлено
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create story');
    }
  }
);

export const viewStory = createAsyncThunk(
  'stories/viewStory',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await storyService.viewStory(storyId); // исправлено
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark story as viewed');
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
        state.error = null;
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
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        const newStory = action.payload;
        const authorId = newStory.author.id;
        const existingGroup = state.items.find(g => g.author.id === authorId);
        if (existingGroup) {
          existingGroup.stories.unshift(newStory);
        } else {
          state.items.unshift({
            author: newStory.author,
            stories: [newStory]
          });
        }
        state.loading = false;
      })
      .addCase(createStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(viewStory.fulfilled, (state, action) => {
        const { storyId, views } = action.payload;
        for (const group of state.items) {
          const story = group.stories.find(s => s.id === storyId);
          if (story) {
            story.views = views;
            break;
          }
        }
      })
      .addCase(viewStory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default storiesSlice.reducer;