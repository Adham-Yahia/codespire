/**
 * postRoutes.js
 * -------------
 * Community post API endpoints mounted at /api/posts.
 *
 *   GET    /api/posts        — list posts (public)
 *   POST   /api/posts        — create post (private)
 *   PUT    /api/posts/:id    — edit own post (private)
 *   DELETE /api/posts/:id    — delete own post (private)
 */

const express = require('express');
const router  = express.Router();

const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  addReply,
  deleteReply,
  likePost,
  dislikePost,
  likeReply,
  dislikeReply
} = require('../controllers/postController');

const { protect, optionalProtect } = require('../middleware/auth');

// ── Public (with optional auth for reactions & permissions) ───────────────────
router.get('/', optionalProtect, getPosts);

// ── Protected ─────────────────────────────────────────────────────────────────
router.post('/',               protect, createPost);
router.put('/:id',             protect, updatePost);
router.delete('/:id',          protect, deletePost);
router.post('/:id/replies',    protect, addReply);
router.delete('/:id/replies/:replyId', protect, deleteReply);
router.post('/:id/like',       protect, likePost);
router.post('/:id/dislike',    protect, dislikePost);
router.post('/:id/replies/:replyId/like',    protect, likeReply);
router.post('/:id/replies/:replyId/dislike', protect, dislikeReply);

module.exports = router;
