import api from './api';

export const storyService = {
  createStory: (formData) =>
    api.post('/stories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  getFeedStories: () =>
    api.get('/stories/feed'),

  getUserStories: (userId) =>
    api.get(`/stories/user/${userId}`),

  viewStory: (storyId) =>
    api.post(`/stories/${storyId}/view`),

  deleteStory: (storyId) =>
    api.delete(`/stories/${storyId}`),

  getStoryAnalytics: (storyId) =>
    api.get(`/stories/${storyId}/analytics`)
};