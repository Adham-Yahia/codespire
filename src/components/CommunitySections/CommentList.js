import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import MentionsInput from '../UI/MentionsInput';
import MentionText from '../UI/MentionText';
import YouTubeReactionButtons from '../UI/YouTubeReactionButtons';
import ReplyItem from './ReplyItem';
import './CommentList.css';

const CommentList = ({ 
  comments, 
  onDeleteComment, 
  onEditComment, 
  onAddReply, 
  onDeleteReply, 
  onLikeComment,
  onDislikeComment,
  onLikeReply,
  onDislikeReply,
  availableUsers = [],
  selectedField 
}) => {
  const { isDarkMode } = useTheme();
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState({});

  const getFieldBadgeColor = (field) => {
    return field === 'ai' ? 'primary' : 'success';
  };

  const getFieldName = (field) => {
    return field === 'ai' ? 'AI' : 'Data Science';
  };

  const handleEditStart = (commentId, text) => {
    setEditingId(commentId);
    setEditingText(text);
  };

  const handleEditSave = (commentId) => {
    if (editingText.trim()) {
      onEditComment(commentId, editingText.trim());
      setEditingId(null);
      setEditingText('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleToggleReplyForm = (commentId, commentAuthor = '') => {
    if (replyingToId === commentId) {
      setReplyingToId(null);
      setReplyText('');
    } else {
      setReplyingToId(commentId);
      // Pre-fill @AuthorName
      const authorMention = commentAuthor ? `@${commentAuthor} ` : '';
      setReplyText(authorMention);
      setExpandedReplies(prev => ({ ...prev, [commentId]: true }));
    }
  };

  const handleToggleRepliesView = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleSendReply = (commentId) => {
    if (!replyText.trim() || !onAddReply) return;
    const textToSend = replyText.trim();
    
    // Instant optimistic submit: clear text & close form immediately
    setReplyText('');
    setReplyingToId(null);
    setExpandedReplies(prev => ({ ...prev, [commentId]: true }));

    // Send direct reply (parentReplyId = null)
    onAddReply(commentId, textToSend, null);
  };

  if (comments.length === 0) {
    return (
      <div className={`comments-empty ${isDarkMode ? 'dark' : ''}`}>
        <div className="empty-icon">💬</div>
        <h4>No Discussions Yet</h4>
        <p>Be the first to share your thoughts and start a conversation!</p>
      </div>
    );
  }

  return (
    <div className={`comments-list ${isDarkMode ? 'dark' : ''}`}>
      {comments.map((comment) => {
        const replies = comment.replies || [];
        const hasReplies = replies.length > 0;
        const commentId = comment.id || comment._id;
        // Default expanded if has replies so users see discussions immediately
        const isExpanded = expandedReplies[commentId] ?? true;

        return (
          <div key={commentId} className={`comment-card ${isDarkMode ? 'dark' : ''}`}>
            <div className="comment-top">
              <div className="comment-author-section">
                <div className="author-avatar">
                  {comment.user.charAt(0).toUpperCase()}
                </div>
                <div className="author-info">
                  <div className="author-name-row">
                    <strong className={`author-name ${isDarkMode ? 'text-light' : ''}`}>
                      {comment.user}
                    </strong>
                    <span className={`field-badge badge ${getFieldBadgeColor(comment.field)}`}>
                      {getFieldName(comment.field)}
                    </span>
                  </div>
                  <small className={`comment-meta ${isDarkMode ? 'text-muted' : 'text-secondary'}`}>
                    {comment.date}
                    {comment.edited && <span className="edited-indicator">• edited</span>}
                  </small>
                </div>
              </div>

              {comment.canEdit && (
                <div className="comment-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEditStart(commentId, comment.text)}
                    title="Edit comment"
                    aria-label="Edit comment"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDeleteComment(commentId)}
                    title="Delete comment"
                    aria-label="Delete comment"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>

            {editingId === commentId ? (
              <div className="edit-mode">
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className={`edit-textarea ${isDarkMode ? 'dark' : ''}`}
                  rows={3}
                  autoFocus
                />
                <div className="edit-actions">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditSave(commentId)}
                  >
                    Save Changes
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className={`comment-text ${isDarkMode ? 'text-light' : ''}`}>
                <MentionText text={comment.text} isDarkMode={isDarkMode} />
              </div>
            )}

            {/* Bottom Actions Bar: YouTube Reactions + Reply Trigger + Reply Toggle */}
            <div className="comment-interaction-bar">
              <YouTubeReactionButtons
                likes={comment.likes || 0}
                dislikes={comment.dislikes || 0}
                userReaction={comment.userReaction}
                onLike={() => onLikeComment && onLikeComment(commentId)}
                onDislike={() => onDislikeComment && onDislikeComment(commentId)}
                size="medium"
                isDarkMode={isDarkMode}
              />

              <button
                className={`reply-toggle-btn ${replyingToId === commentId ? 'active' : ''}`}
                onClick={() => handleToggleReplyForm(commentId, comment.user)}
              >
                💬 {replyingToId === commentId ? 'Cancel' : 'Reply'}
              </button>

              {hasReplies && (
                <button
                  className="view-replies-btn"
                  onClick={() => handleToggleRepliesView(commentId)}
                >
                  {isExpanded 
                    ? `▲ Hide ${replies.length === 1 ? 'reply' : `replies (${replies.length})`}` 
                    : `▼ View ${replies.length === 1 ? '1 reply' : `${replies.length} replies`}`}
                </button>
              )}
            </div>

            {/* Direct Reply Input Form */}
            {replyingToId === commentId && (
              <div className={`reply-form-wrapper ${isDarkMode ? 'dark' : ''}`}>
                <MentionsInput
                  value={replyText}
                  onChange={setReplyText}
                  placeholder={`Reply to ${comment.user}... (use @ to mention)`}
                  rows={2}
                  isDarkMode={isDarkMode}
                  availableUsers={availableUsers}
                  autoFocus
                  className="reply-textarea"
                />
                <div className="reply-form-actions">
                  <button
                    className="btn btn-sm btn-primary reply-submit-btn"
                    disabled={!replyText.trim()}
                    onClick={() => handleSendReply(commentId)}
                  >
                    Post Reply
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => { setReplyingToId(null); setReplyText(''); }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Deep Nested Replies Thread (Recursive) */}
            {hasReplies && isExpanded && (
              <div className="replies-thread">
                {replies.map((reply) => {
                  const replyId = reply.id || reply._id;
                  return (
                    <ReplyItem
                      key={replyId}
                      reply={reply}
                      commentId={commentId}
                      onAddReply={onAddReply}
                      onDeleteReply={onDeleteReply}
                      onLikeReply={onLikeReply}
                      onDislikeReply={onDislikeReply}
                      availableUsers={availableUsers}
                      isDarkMode={isDarkMode}
                      depth={1}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
