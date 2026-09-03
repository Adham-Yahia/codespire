import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';
import './FieldCommunityComments.css';

const FieldCommunityComments = ({ 
  comments, 
  onAddComment, 
  onDeleteComment, 
  onEditComment 
}) => {
  const { isDarkMode } = useTheme();
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        onAddComment(newComment);
        setNewComment('');
        setIsSubmitting(false);
      }, 300);
    }
  };

  const handleEditStart = (commentId, text) => {
    setEditingId(commentId);
    setEditingText(text);
  };

  const handleEditSave = (commentId) => {
    if (editingText.trim()) {
      onEditComment(commentId, editingText);
      setEditingId(null);
      setEditingText('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText('');
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
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts, experiences, or ask questions..."
                  className={`comment-input ${isDarkMode ? 'dark' : ''}`}
                  disabled={isSubmitting}
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="comment-submit-btn"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </Form>

            <div className="comments-section">
              {comments.length === 0 ? (
                <div className="empty-state">
                  <p className={`text-muted ${isDarkMode ? 'text-light-50' : ''}`}>
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`comment-item ${isDarkMode ? 'dark' : ''}`}
                  >
                    <div className="comment-header">
                      <div className="comment-user-info">
                        <strong className={isDarkMode ? 'text-light' : ''}>
                          {comment.user}
                        </strong>
                        <small className="comment-date">
                          {comment.date}
                          {comment.edited && <span className="edited-badge">edited</span>}
                        </small>
                      </div>
                      {comment.canEdit && (
                        <div className="comment-actions">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleEditStart(comment.id, comment.text)}
                            title="Edit comment"
                          >
                            ✏️
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => onDeleteComment(comment.id)}
                            title="Delete comment"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>

                    {editingId === comment.id ? (
                      <div className="edit-section">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className={`edit-input ${isDarkMode ? 'dark' : ''}`}
                        />
                        <div className="edit-actions mt-2">
                          <Button 
                            size="sm" 
                            variant="primary"
                            onClick={() => handleEditSave(comment.id)}
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
                      <p className={`comment-text ${isDarkMode ? 'text-light' : ''}`}>
                        {comment.text}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default FieldCommunityComments;
