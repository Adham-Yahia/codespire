/**
 * MentionsInput.js
 * ---------------
 * A textarea component that supports @username mentions with autocomplete.
 * When users type @, it shows a dropdown of available users to mention.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './MentionsInput.css';

const MentionsInput = ({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  isDarkMode = false,
  availableUsers = [],
  autoFocus = false,
  className = ''
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Extract the current mention being typed
  const getCurrentMention = (text, position) => {
    const textBeforeCursor = text.substring(0, position);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex === -1) return null;
    
    // Check if there's a space after the @
    const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
    if (textAfterAt.includes(' ')) return null;
    
    return {
      start: lastAtIndex,
      query: textAfterAt
    };
  };

  // Handle text input changes
  const handleChange = (e) => {
    const newValue = e.target.value;
    const newPosition = e.target.selectionStart;
    
    onChange(newValue);
    setCursorPosition(newPosition);

    const mention = getCurrentMention(newValue, newPosition);
    
    if (mention) {
      setMentionQuery(mention.query);
      const filtered = availableUsers.filter(user =>
        user.name.toLowerCase().includes(mention.query.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowSuggestions(filtered.length > 0);
      setSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
      setFilteredUsers([]);
    }
  };

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSuggestionIndex(prev => 
        Math.min(prev + 1, filteredUsers.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSuggestionIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (filteredUsers[suggestionIndex]) {
        insertMention(filteredUsers[suggestionIndex].name);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Insert a selected mention
  const insertMention = (username) => {
    const mention = getCurrentMention(value, cursorPosition);
    if (!mention) return;

    const newValue = 
      value.substring(0, mention.start) + 
      '@' + username + ' ' + 
      value.substring(cursorPosition);
    
    onChange(newValue);
    setShowSuggestions(false);
    setFilteredUsers([]);

    // Move cursor after the inserted mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = mention.start + username.length + 2;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
        textareaRef.current.focus();
      }
    }, 0);
  };

  // Handle click on suggestion
  const handleSuggestionClick = (username) => {
    insertMention(username);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mentions-input-container">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`mentions-textarea ${isDarkMode ? 'dark' : ''} ${className}`}
      />
      
      {showSuggestions && filteredUsers.length > 0 && (
        <div 
          ref={suggestionsRef}
          className={`mentions-suggestions ${isDarkMode ? 'dark' : ''}`}
        >
          {filteredUsers.map((user, index) => (
            <div
              key={user._id || user.id}
              className={`suggestion-item ${index === suggestionIndex ? 'active' : ''} ${isDarkMode ? 'dark' : ''}`}
              onClick={() => handleSuggestionClick(user.name)}
              onMouseEnter={() => setSuggestionIndex(index)}
            >
              <div className="suggestion-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="suggestion-info">
                <div className="suggestion-name">{user.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionsInput;