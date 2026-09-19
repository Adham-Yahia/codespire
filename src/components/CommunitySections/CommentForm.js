import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';
import MentionsInput from '../UI/MentionsInput';
import './CommentForm.css';

const CommentForm = ({ selectedField, onFieldChange, onSubmit, disabled = false, availableUsers = [] }) => {
  const { isDarkMode } = useTheme();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled || !commentText.trim()) return;
    
    const textToSubmit = commentText.trim();
    setCommentText(''); // Instant clear for zero-delay optimistic UX
    onSubmit({
      text: textToSubmit,
      field: selectedField === 'all' ? 'ai' : selectedField
    });
  };

  const handleFieldChange = (e) => {
    onFieldChange(e.target.value);
  };

  return (
    <div className={`comment-form-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="form-header">
        <h5 className={`form-title ${isDarkMode ? 'text-light' : ''}`}>
          💭 Share Your Thoughts
        </h5>
        <p className={`form-subtitle ${isDarkMode ? 'text-muted' : 'text-secondary'}`}>
          Join the conversation and help others with your insights and experiences
        </p>
      </div>

      <Form onSubmit={handleSubmit} className="comment-form">
        <Form.Group className="mb-3">
          <Form.Label className={`form-label ${isDarkMode ? 'text-light' : ''}`}>
            Your Comment
          </Form.Label>
          <MentionsInput
            value={commentText}
            onChange={setCommentText}
            placeholder="Share your experience, ask questions, provide insights, or discuss career paths... Use @username to mention others"
            rows={4}
            disabled={isSubmitting || disabled}
            isDarkMode={isDarkMode}
            availableUsers={availableUsers}
          />
          <div className={`char-counter ${isDarkMode ? 'text-muted' : 'text-secondary'}`}>
            {commentText.length}/2000
          </div>
        </Form.Group>

        <Row className="g-2 align-items-end">
          <Col xs={12} sm="auto" className="flex-grow-1">
            <Form.Group className="mb-0">
              <Form.Label className={`form-label ${isDarkMode ? 'text-light' : ''}`}>
                Category
              </Form.Label>
              <Form.Select
                value={selectedField}
                onChange={handleFieldChange}
                className={`field-select ${isDarkMode ? 'dark' : ''}`}
              >
                <option value="all">General Discussion</option>
                <option value="ai">Artificial Intelligence</option>
                <option value="dataScience">Data Science</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} sm="auto">
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || !commentText.trim() || disabled}
              className="submit-button"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-icon">⏳</span> Posting...
                </>
              ) : (
                <>
                  <span className="send-icon">→</span> Post Comment
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Form>

      <div className={`form-footer ${isDarkMode ? 'dark' : ''}`}>
        <p className={`footer-text ${isDarkMode ? 'text-muted' : 'text-secondary'}`}>
          💡 Tip: Be respectful, constructive, and helpful. Your comments help build a great community!
        </p>
      </div>
    </div>
  );
};

export default CommentForm;
