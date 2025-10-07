import React from 'react';
import api from './api';

// postsService.js - contains functions for interacting with posts
export const postsService = {
    getPosts: () => api.get('/posts'),
    createPost: (postData) => api.post('/posts', postData),
    likePost: (postId) => api.post(`/posts/${postId}/like`),
    addComment: (postId, commentData) => api.post(`/posts/${postId}/comments`, commentData),
}