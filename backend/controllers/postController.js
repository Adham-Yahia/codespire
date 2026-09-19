/**
 * postController.js
 * -----------------
 * Business logic for community post endpoints.
 *
 * Routes handled:
 *   GET  /api/posts          — list all posts (public, paginated, newest first)
 *   POST /api/posts          — create a post (auth required)
 *   PUT  /api/posts/:id      — edit own post (auth required)
 *   DELETE /api/posts/:id    — delete own post (auth required)
 */

const mongoose = require('mongoose');
const Post = require('../models/Post');

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build nested reply structure from flat replies based on parentReplyId
 */
const buildNestedReplies = (flatReplies, parentId = null, currentUserId) => {
  return flatReplies
    .filter(reply => {
      const replyParentId = reply.parentReplyId ? reply.parentReplyId.toString() : null;
      const targetParentId = parentId ? parentId.toString() : null;
      return replyParentId === targetParentId;
    })
    .map(reply => ({
      ...formatReply(reply, currentUserId),
      replies: buildNestedReplies(flatReplies, reply._id, currentUserId)
    }));
};

/**
 * Formats a Reply document into the shape the frontend expects.
 */
const formatReply = (reply, currentUserId) => {
  const userReaction = currentUserId && reply.userReactions 
    ? reply.userReactions.get(currentUserId.toString()) 
    : null;
  
  return {
    _id:           reply._id,
    id:            reply._id,
    user:          reply.author?.name || 'Anonymous',
    authorId:      reply.author?._id || reply.author,
    text:          reply.text,
    date:          reply.createdAt ? new Date(reply.createdAt).toISOString().split('T')[0] : '',
    edited:        reply.edited || false,
    canEdit:       currentUserId ? (reply.author?._id || reply.author)?.toString() === currentUserId.toString() : false,
    likes:         reply.likes || 0,
    dislikes:      reply.dislikes || 0,
    userReaction:  userReaction,
    parentReplyId: reply.parentReplyId ? reply.parentReplyId.toString() : null,
    replies:       []
  };
};

/**
 * Formats a Post document into the shape the frontend expects.
 */
const formatPost = (post, currentUserId) => {
  const userReaction = currentUserId && post.userReactions 
    ? post.userReactions.get(currentUserId.toString()) 
    : null;
  
  const flatReplies = post.replies || [];
  const nestedReplies = buildNestedReplies(flatReplies, null, currentUserId);
  
  return {
    _id:       post._id,
    id:        post._id,          // alias for legacy frontend compat
    user:      post.author?.name  || 'Anonymous',
    authorId:  post.author?._id,
    field:     post.field,
    text:      post.text,
    date:      post.createdAt?.toISOString().split('T')[0],
    edited:    post.edited,
    canEdit:   currentUserId ? post.author?._id?.toString() === currentUserId.toString() : false,
    likes:     post.likes || 0,
    dislikes:  post.dislikes || 0,
    userReaction: userReaction,
    replies:   nestedReplies
  };
};

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * @route   GET /api/posts
 * @desc    Return all posts, newest first.  Optional ?field= filter.
 * @access  Public
 */
const getPosts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.field && req.query.field !== 'all') {
      filter.field = req.query.field;
    }

    const posts = await Post.find(filter)
      .populate('author', 'name')
      .populate('replies.author', 'name')
      .sort({ createdAt: -1 })
      .limit(200);

    const currentUserId = req.user?._id;
    res.json({ success: true, data: posts.map(p => formatPost(p, currentUserId)) });
  } catch (err) {
    console.error('getPosts error:', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching posts' });
  }
};

/**
 * @route   POST /api/posts
 * @desc    Create a new community post
 * @access  Private (JWT)
 */
const createPost = async (req, res) => {
  try {
    const { text, field } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Post text is required' });
    }

    const post = await Post.create({
      author: req.user._id,
      text:   text.trim(),
      field:  field || 'all'
    });

    // Re-fetch with populated author so we can return the name
    const populated = await post.populate('author', 'name');

    res.status(201).json({ success: true, data: formatPost(populated, req.user._id) });
  } catch (err) {
    console.error('createPost error:', err.message);
    res.status(500).json({ success: false, message: 'Server error creating post' });
  }
};

/**
 * @route   PUT /api/posts/:id
 * @desc    Edit own post text
 * @access  Private (JWT) — only the author may edit
 */
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Ensure the requesting user owns this post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this post' });
    }

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Post text cannot be empty' });
    }

    post.text   = text.trim();
    post.edited = true;
    await post.save();

    const populated = await post.populate([
      { path: 'author', select: 'name' },
      { path: 'replies.author', select: 'name' }
    ]);
    res.json({ success: true, data: formatPost(populated, req.user._id) });
  } catch (err) {
    console.error('updatePost error:', err.message);
    res.status(500).json({ success: false, message: 'Server error updating post' });
  }
};

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete own post
 * @access  Private (JWT) — only the author may delete
 */
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('deletePost error:', err.message);
    res.status(500).json({ success: false, message: 'Server error deleting post' });
  }
};

/**
 * @route   POST /api/posts/:id/replies
 * @desc    Add a reply to a post
 * @access  Private (JWT)
 */
const addReply = async (req, res) => {
  try {
    const { text, parentReplyId } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Reply text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Validate parentReplyId to prevent Mongoose CastErrors
    let validParentId = null;
    if (parentReplyId && mongoose.Types.ObjectId.isValid(parentReplyId)) {
      const parentExists = post.replies.some(r => r._id.toString() === parentReplyId.toString());
      if (parentExists) {
        validParentId = parentReplyId;
      }
    }

    // Add as a flat reply with parentReplyId for nested relationship
    post.replies.push({
      author: req.user._id,
      text: text.trim(),
      parentReplyId: validParentId
    });

    await post.save();
    const populated = await post.populate([
      { path: 'author', select: 'name' },
      { path: 'replies.author', select: 'name' }
    ]);

    res.status(201).json({ success: true, data: formatPost(populated, req.user._id) });
  } catch (err) {
    console.error('addReply error:', err.message);
    res.status(500).json({ success: false, message: 'Server error adding reply' });
  }
};

/**
 * @route   DELETE /api/posts/:id/replies/:replyId
 * @desc    Delete a reply from a post (with cascading deletion of child replies)
 * @access  Private (JWT) — author of reply or author of post
 */
const deleteReply = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const targetReply = post.replies.id(req.params.replyId);
    if (!targetReply) {
      return res.status(404).json({ success: false, message: 'Reply not found' });
    }

    if (
      targetReply.author.toString() !== req.user._id.toString() &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this reply' });
    }

    // Recursively collect target reply and all descendant reply IDs to prevent orphaned sub-replies
    const toDeleteIds = new Set([req.params.replyId.toString()]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const r of post.replies) {
        if (r.parentReplyId && toDeleteIds.has(r.parentReplyId.toString()) && !toDeleteIds.has(r._id.toString())) {
          toDeleteIds.add(r._id.toString());
          changed = true;
        }
      }
    }

    post.replies = post.replies.filter(r => !toDeleteIds.has(r._id.toString()));
    await post.save();

    const populated = await post.populate([
      { path: 'author', select: 'name' },
      { path: 'replies.author', select: 'name' }
    ]);

    res.json({ success: true, data: formatPost(populated, req.user._id) });
  } catch (err) {
    console.error('deleteReply error:', err.message);
    res.status(500).json({ success: false, message: 'Server error deleting reply' });
  }
};

/**
 * @route   POST /api/posts/:id/like
 * @desc    Like or unlike a post
 * @access  Private (JWT)
 */
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const currentReaction = post.userReactions.get(userId);

    if (currentReaction === 'like') {
      // Unlike: remove like
      post.likes = Math.max(0, post.likes - 1);
      post.userReactions.delete(userId);
    } else if (currentReaction === 'dislike') {
      // Switch from dislike to like
      post.dislikes = Math.max(0, post.dislikes - 1);
      post.likes = post.likes + 1;
      post.userReactions.set(userId, 'like');
    } else {
      // Add like
      post.likes = post.likes + 1;
      post.userReactions.set(userId, 'like');
    }

    await post.save();
    const populated = await post.populate([
      { path: 'author', select: 'name' },
      { path: 'replies.author', select: 'name' }
    ]);

    res.json({ success: true, data: formatPost(populated, req.user._id) });
  } catch (err) {
    console.error('likePost error:', err.message);
    res.status(500).json({ success: false, message: 'Server error liking post' });
  }
};

/**
 * @route   POST /api/posts/:id/dislike
 * @desc    Dislike or undislike a post
 * @access  Private (JWT)
 */
const dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const currentReaction = post.userReactions.get(userId);

    if (currentReaction === 'dislike') {
      // Remove dislike
      post.dislikes = Math.max(0, post.dislikes - 1);
      post.userReactions.delete(userId);
    } else if (currentReaction === 'like') {
      // Switch from like to dislike
      post.likes = Math.max(0, post.likes - 1);
      post.dislikes = post.dislikes + 1;
      post.userReactions.set(userId, 'dislike');
    } else {
      // Add dislike
      post.dislikes = post.dislikes + 1;
      post.userReactions.set(userId, 'dislike');
    }

    await post.save();
    const populated = await post.populate([
      { path: 'author', select: 'name' },
      { path: 'replies.author', select: 'name' }
    ]);

    res.json({ success: true, data: formatPost(populated, req.user._id) });
  } catch (err) {
    console.error('dislikePost error:', err.message);
    res.status(500).json({ success: false, message: 'Server error disliking post' });
  }
};

/**
 * Helper function to find a reply (including nested replies) by ID
 */
const findReplyInReplies = (replies, replyId) => {
  if (!replyId || !replies) return null;
  const targetId = replyId.toString();

  // If Mongoose DocumentArray has .id()
  if (typeof replies.id === 'function') {
    const found = replies.id(targetId);
    if (found) return found;
  }

  for (const reply of replies) {
    if (reply._id && reply._id.toString() === targetId) {
      return reply;
    }
    if (reply.replies && reply.replies.length > 0) {
      const nested = findReplyInReplies(reply.replies, targetId);
      if (nested) return nested;
    }
  }
  return null;
};

/**
 * @route   POST /api/posts/:id/replies/:replyId/like
 * @desc    Like or unlike a reply (including nested replies)
 * @access  Private (JWT)
 */
const likeReply = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const reply = findReplyInReplies(post.replies, req.params.replyId);
    if (!reply) {
      return res.status(404).json({ success: false, message: 'Reply not found' });
    }

    const userId = req.user._id.toString();
    const currentReaction = reply.userReactions.get(userId);

    if (currentReaction === 'like') {
      // Unlike: remove like
      reply.likes = Math.max(0, reply.likes - 1);
      reply.userReactions.delete(userId);
    } else if (currentReaction === 'dislike') {
      // Switch from dislike to like
      reply.dislikes = Math.max(0, reply.dislikes - 1);
      reply.likes = reply.likes + 1;
      reply.userReactions.set(userId, 'like');
    } else {
      // Add like
      reply.likes = reply.likes + 1;
      reply.userReactions.set(userId, 'like');
    }

    await post.save();
    const populated = await post.populate([
      { path: 'author', select: 'name' },
      { path: 'replies.author', select: 'name' }
    ]);

    res.json({ success: true, data: formatPost(populated, req.user._id) });
  } catch (err) {
    console.error('likeReply error:', err.message);
    res.status(500).json({ success: false, message: 'Server error liking reply' });
  }
};

/**
 * @route   POST /api/posts/:id/replies/:replyId/dislike
 * @desc    Dislike or undislike a reply (including nested replies)
 * @access  Private (JWT)
 */
const dislikeReply = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const reply = findReplyInReplies(post.replies, req.params.replyId);
    if (!reply) {
      return res.status(404).json({ success: false, message: 'Reply not found' });
    }

    const userId = req.user._id.toString();
    const currentReaction = reply.userReactions.get(userId);

    if (currentReaction === 'dislike') {
      // Remove dislike
      reply.dislikes = Math.max(0, reply.dislikes - 1);
      reply.userReactions.delete(userId);
    } else if (currentReaction === 'like') {
      // Switch from like to dislike
      reply.likes = Math.max(0, reply.likes - 1);
      reply.dislikes = reply.dislikes + 1;
      reply.userReactions.set(userId, 'dislike');
    } else {
      // Add dislike
      reply.dislikes = reply.dislikes + 1;
      reply.userReactions.set(userId, 'dislike');
    }

    await post.save();
    const populated = await post.populate([
      { path: 'author', select: 'name' },
      { path: 'replies.author', select: 'name' }
    ]);

    res.json({ success: true, data: formatPost(populated, req.user._id) });
  } catch (err) {
    console.error('dislikeReply error:', err.message);
    res.status(500).json({ success: false, message: 'Server error disliking reply' });
  }
};

module.exports = { getPosts, createPost, updatePost, deletePost, addReply, deleteReply, likePost, dislikePost, likeReply, dislikeReply };
