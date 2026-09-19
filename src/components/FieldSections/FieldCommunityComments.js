import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';
import MentionsInput from '../UI/MentionsInput';
import MentionText from '../UI/MentionText';
import YouTubeReactionButtons from '../UI/YouTubeReactionButtons';
import ReplyItem from '../CommunitySections/ReplyItem';
import './FieldCommunityComments.css';

const FieldCommunityComments = ({ 
  comments = [], 
  onAddComment, 
  onDeleteComment, 
  onEditComment,
  onAddReply,
  onDeleteReply,
  onLikeComment,
  onDislikeComment,
  onLikeReply,
  onDislikeReply,
  availableUsers = [],
  loading = false,
  disabled = false
}) => {
  const { isDarkMode } = useTheme();
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled || !newComment.trim() || !onAddComment) return;
    const textToSend = newComment.trim();
    setNewComment(''); // Instant clear for optimistic UI
    onAddComment(textToSend);
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
    setReplyText('');
    setReplyingToId(null);
    setExpandedReplies(prev => ({ ...prev, [commentId]: true }));
    onAddReply(commentId, textToSend, null);
  };

  return (
    <Row className="mb-5">
      <Col>
        <h2 className={`mb-4 fw-bold ${isDarkMode ? 'text-light' : ''}`}>
          Community Comments
        </h2>

        <Card className={`comment-card ${isDarkMode ? 'dark' : 'light'}`}>
          <Card.Body>
            <Form onSubmit={handleSubmit} className="mb-4">
              <Form.Group className="mb-3">
                <Form.Label className={isDarkMode ? 'text-light' : ''}>
                  Share Your Thoughts:
                </Form.Label>
                <MentionsInput
                  value={newComment}
                  onChange={setNewComment}
                  placeholder={disabled ? 'Sign in to post comments...' : 'Share your thoughts, experiences, or ask questions... (use @ to mention)'}
                  rows={3}
                  disabled={disabled}
                  isDarkMode={isDarkMode}
                  availableUsers={availableUsers}
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={!newComment.trim() || disabled}
                  className="comment-submit-btn"
                >
                  Post Comment
                </Button>
              </div>
            </Form>

            <div className="comments-section">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: isDarkMode ? 'rgba(255,255,255,0.4)' : '#aaa' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                  Loading comments…
                </div>
              ) : comments.length === 0 ? (
                <div className="empty-state">
                  <p className={`text-muted ${isDarkMode ? 'text-light-50' : ''}`}>
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                comments.map((comment) => {
                  const replies = comment.replies || [];
                  const hasReplies = replies.length > 0;
                  const commentId = comment.id || comment._id;
                  const isExpanded = expandedReplies[commentId] ?? true;

                  return (
                    <div 
                      key={commentId} 
                      className={`comment-item ${isDarkMode ? 'dark' : ''}`}
                    >
                      <div className="comment-header">
                        <div className="comment-user-info">
                          <span className="comment-avatar">
                            {comment.user ? comment.user.charAt(0).toUpperCase() : 'U'}
                          </span>
                          <div>
                            <strong className={`comment-author-name ${isDarkMode ? 'text-light' : ''}`}>
                              {comment.user}
                            </strong>
                            <small className="comment-date">
                              {comment.date}
                              {comment.edited && <span className="edited-badge">• edited</span>}
                            </small>
                          </div>
                        </div>
                        {comment.canEdit && (
                          <div className="comment-actions">
                            <button 
                              className="action-btn edit-btn"
                              onClick={() => handleEditStart(commentId, comment.text)}
                              title="Edit comment"
                            >
                              ✏️
                            </button>
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => onDeleteComment(commentId)}
                              title="Delete comment"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>

                      {editingId === commentId ? (
                        <div className="edit-section">
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className={`edit-input ${isDarkMode ? 'dark' : ''}`}
                            autoFocus
                          />
                          <div className="edit-actions mt-2">
                            <Button 
                              size="sm" 
                              variant="primary"
                              onClick={() => handleEditSave(commentId)}
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-secondary"
                              onClick={handleEditCancel}
                            >
                              Cancel
                            </Button>
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

                      {/* Reply Input Form */}
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
                            <Button
                              size="sm"
                              variant="primary"
                              disabled={!replyText.trim()}
                              onClick={() => handleSendReply(commentId)}
                              className="reply-submit-btn"
                            >
                              Post Reply
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => { setReplyingToId(null); setReplyText(''); }}
                            >
                              Cancel
                            </Button>
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
                })
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default FieldCommunityComments;
