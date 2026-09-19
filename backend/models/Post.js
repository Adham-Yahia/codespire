/**
 * Post.js  (Mongoose Model)
 * -------------------------
 * Represents a single community post/comment in the CodeSpire platform.
 *
 * Schema:
 *   author      — ref to the User who created it
 *   text        — the post body (max 2000 chars)
 *   field       — topic category: 'all' | 'ai' | 'dataScience' | etc.
 *   edited      — set to true after any edit
 *   timestamps  — createdAt, updatedAt (auto)
 */

const mongoose = require('mongoose');

// Simple nested reply schema (flat structure to avoid circular references)
const replySchema = new mongoose.Schema(
  {
    author: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true
    },
    text: {
      type:      String,
      required:  [true, 'Reply text is required'],
      trim:      true,
      maxlength: [1000, 'Reply cannot exceed 1000 characters']
    },
    edited: {
      type:    Boolean,
      default: false
    },
    likes: {
      type:    Number,
      default: 0
    },
    dislikes: {
      type:    Number,
      default: 0
    },
    userReactions: {
      type:    Map,
      of:      String, // userId -> 'like' or 'dislike'
      default: {}
    },
    parentReplyId: {
      type:    mongoose.Schema.Types.ObjectId,
      default: null
    } // For nested replies (reply-to-reply) - references parent reply ID
  },
  {
    timestamps: true
  }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true
    },
    text: {
      type:      String,
      required:  [true, 'Post text is required'],
      trim:      true,
      maxlength: [2000, 'Post cannot exceed 2000 characters']
    },
    field: {
      type:    String,
      enum:    ['all', 'ai', 'dataScience', 'web-development', 'mobile-development', 'cybersecurity', 'cloud-computing'],
      default: 'all'
    },
    edited: {
      type:    Boolean,
      default: false
    },
    likes: {
      type:    Number,
      default: 0
    },
    dislikes: {
      type:    Number,
      default: 0
    },
    userReactions: {
      type:    Map,
      of:      String, // userId -> 'like' or 'dislike'
      default: {}
    },
    replies: [replySchema]
  },
  {
    timestamps: true  // createdAt, updatedAt
  }
);

module.exports = mongoose.model('Post', postSchema);
