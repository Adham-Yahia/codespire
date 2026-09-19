/**
 * community.js  (service)
 * -----------------------
 * API helpers for the Community (posts) feature.
 * All calls go through the shared api.js wrapper which
 * handles auth tokens and normalised errors.
 */

import api from './api';

const communityService = {
  /** Fetch all posts. Optionally filter by field slug. */
  getPosts: (field) => {
    const qs = field && field !== 'all' ? `?field=${field}` : '';
    return api.get(`/posts${qs}`);
  },

  /** Create a new post (requires login). */
  createPost: (text, field) =>
    api.post('/posts', { text, field: field || 'all' }),

  /** Edit own post (requires login). */
  updatePost: (id, text) =>
    api.put(`/posts/${id}`, { text }),

  /** Delete own post (requires login). */
  deletePost: (id) =>
    api.delete(`/posts/${id}`),

  /** Add a reply to a post (requires login). */
  addReply: (postId, text, parentReplyId = null) =>
    api.post(`/posts/${postId}/replies`, { text, parentReplyId }),

  /** Delete a reply (requires login). */
  deleteReply: (postId, replyId) =>
    api.delete(`/posts/${postId}/replies/${replyId}`),

  /** Like or unlike a post (requires login). */
  likePost: (postId) =>
    api.post(`/posts/${postId}/like`),

  /** Dislike or undislike a post (requires login). */
  dislikePost: (postId) =>
    api.post(`/posts/${postId}/dislike`),

  /** Like or unlike a reply (requires login). */
  likeReply: (postId, replyId) =>
    api.post(`/posts/${postId}/replies/${replyId}/like`),

  /** Dislike or undislike a reply (requires login). */
  dislikeReply: (postId, replyId) =>
    api.post(`/posts/${postId}/replies/${replyId}/dislike`),

  /** Fetch registered users for mentions autocomplete */
  getUsers: () =>
    api.get('/auth/users')
};

export default communityService;
