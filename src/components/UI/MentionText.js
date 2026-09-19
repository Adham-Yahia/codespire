import React from 'react';
import './MentionText.css';

/**
 * MentionText parses text containing @username and highlights each mention.
 * Handles mentions with letters, numbers, underscores, and dots (e.g., @Sarah M., @john_doe).
 */
const MentionText = ({ text = '', className = '', isDarkMode = false }) => {
  if (!text) return null;

  // Regex matches @ followed by name up to punctuation or end
  // E.g. @Sarah M. or @Ahmed or @john_doe
  const mentionRegex = /(@[\w\u0600-\u06FF.-]+(?:\s[\w\u0600-\u06FF.-]+)?)/g;

  const parts = text.split(mentionRegex);

  return (
    <span className={`mention-text-wrapper ${className} ${isDarkMode ? 'dark' : 'light'}`}>
      {parts.map((part, index) => {
        if (part && part.startsWith('@') && part.length > 1) {
          return (
            <span key={index} className="mention-tag" title={`Mentioned: ${part}`}>
              {part}
            </span>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};

export default MentionText;
