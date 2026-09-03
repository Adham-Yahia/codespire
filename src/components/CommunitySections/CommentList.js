import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './CommentList.css';

const CommentList = ({ comments, onDeleteComment, onEditComment, selectedField }) => {
  const { isDarkMode } = useTheme();
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

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
      onEditComment(commentId, editingText);
      setEditingId(null);
      setEditingText('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText('');
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
      {comments.map((comment) => (
        <div key={comment.id} className={`comment-card ${isDarkMode ? 'dark' : ''}`}>
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
                  onClick={() => handleEditStart(comment.id, comment.text)}
                  title="Edit comment"
                  aria-label="Edit comment"
                >
                  ✏️
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => onDeleteComment(comment.id)}
                  title="Delete comment"
                  aria-label="Delete comment"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>

          {editingId === comment.id ? (
            <div className="edit-mode">
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className={`edit-textarea ${isDarkMode ? 'dark' : ''}`}
                rows={3}
              />
              <div className="edit-actions">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleEditSave(comment.id)}
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
            <p className={`comment-text ${isDarkMode ? 'text-light' : ''}`}>
              {comment.text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
