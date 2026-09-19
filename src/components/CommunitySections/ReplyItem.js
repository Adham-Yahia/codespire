import React, { useState } from 'react';
import YouTubeReactionButtons from '../UI/YouTubeReactionButtons';
import MentionsInput from '../UI/MentionsInput';
import MentionText from '../UI/MentionText';
import './ReplyItem.css';

/**
 * Recursive ReplyItem component.
 * Allows infinite nesting (reply-to-reply) with full YouTube-style reactions,
 * @mentions support, and clean thread aesthetics.
 */
const ReplyItem = ({
  reply,
  commentId,
  onAddReply,
  onDeleteReply,
  onLikeReply,
  onDislikeReply,
  availableUsers = [],
  isDarkMode = false,
  depth = 1
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isExpanded, setIsExpanded] = useState(true); // Default open so users see replies

  const replyId = reply.id || reply._id;
  const childReplies = reply.replies || [];
  const hasChildren = childReplies.length > 0;

  const handleOpenReplyForm = () => {
    if (isReplying) {
      setIsReplying(false);
      setReplyText('');
    } else {
      setIsReplying(true);
      // Pre-fill @Username to tag the author seamlessly
      const authorMention = reply.user ? `@${reply.user} ` : '';
      setReplyText(authorMention);
      setIsExpanded(true);
    }
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyText('');
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !onAddReply) return;

    // Send reply with parentReplyId = this reply's id
    onAddReply(commentId, replyText.trim(), replyId);
    setReplyText('');
    setIsReplying(false);
    setIsExpanded(true);
  };

  return (
    <div className={`reply-item-container depth-${Math.min(depth, 4)} ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="reply-item-main">
        {/* Author Header */}
        <div className="reply-header">
          <div className="reply-author-info">
            <div className="reply-avatar">
              {reply.user ? reply.user.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="reply-meta-info">
              <span className={`reply-author-name ${isDarkMode ? 'text-light' : ''}`}>
                {reply.user || 'Anonymous'}
              </span>
              <span className="reply-date">
                {reply.date}
                {reply.edited && <span className="reply-edited-tag">• edited</span>}
              </span>
            </div>
          </div>

          {reply.canEdit && onDeleteReply && (
            <button
              type="button"
              className="reply-action-btn reply-delete-btn"
              onClick={() => onDeleteReply(commentId, replyId)}
              title="Delete reply"
              aria-label="Delete reply"
            >
              🗑️
            </button>
          )}
        </div>

        {/* Reply Body with Mention Highlights */}
        <div className={`reply-content ${isDarkMode ? 'text-light' : ''}`}>
          <MentionText text={reply.text} isDarkMode={isDarkMode} />
        </div>

        {/* Bottom Bar: YouTube Reactions + Reply Button */}
        <div className="reply-actions-bar">
          <YouTubeReactionButtons
            likes={reply.likes || 0}
            dislikes={reply.dislikes || 0}
            userReaction={reply.userReaction}
            onLike={() => onLikeReply && onLikeReply(commentId, replyId)}
            onDislike={() => onDislikeReply && onDislikeReply(commentId, replyId)}
            size="small"
            isDarkMode={isDarkMode}
          />

          <button
            type="button"
            className={`reply-trigger-btn ${isReplying ? 'active' : ''}`}
            onClick={handleOpenReplyForm}
          >
            💬 {isReplying ? 'Cancel' : 'Reply'}
          </button>

          {hasChildren && (
            <button
              type="button"
              className="reply-expand-toggle-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded
                ? `▲ Hide ${childReplies.length === 1 ? 'reply' : `replies (${childReplies.length})`}`
                : `▼ View ${childReplies.length === 1 ? '1 reply' : `${childReplies.length} replies`}`}
            </button>
          )}
        </div>

        {/* Inline Reply Form */}
        {isReplying && (
          <form onSubmit={handleSubmitReply} className={`inline-reply-box ${isDarkMode ? 'dark' : ''}`}>
            <MentionsInput
              value={replyText}
              onChange={setReplyText}
              placeholder={`Reply to ${reply.user || 'this comment'}... (use @ to mention)`}
              rows={2}
              isDarkMode={isDarkMode}
              availableUsers={availableUsers}
              autoFocus
              className="inline-reply-textarea"
            />
            <div className="inline-reply-actions">
              <button
                type="submit"
                className="btn btn-sm btn-primary inline-reply-submit"
                disabled={!replyText.trim()}
              >
                Reply
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={handleCancelReply}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Recursive Children Replies Thread */}
      {hasChildren && isExpanded && (
        <div className="reply-children-thread">
          {childReplies.map((child) => {
            const childId = child.id || child._id;
            return (
              <ReplyItem
                key={childId}
                reply={child}
                commentId={commentId}
                onAddReply={onAddReply}
                onDeleteReply={onDeleteReply}
                onLikeReply={onLikeReply}
                onDislikeReply={onDislikeReply}
                availableUsers={availableUsers}
                isDarkMode={isDarkMode}
                depth={depth + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReplyItem;
