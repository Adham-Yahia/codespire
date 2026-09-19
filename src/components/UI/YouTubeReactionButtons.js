import React from 'react';
import './YouTubeReactionButtons.css';

/**
 * YouTube-style Like & Dislike reaction buttons.
 * Clean, borderless icon-only design with SVG thumbs up / down.
 * Active Like highlights in clean Blue, active Dislike highlights in clean Red.
 */
const YouTubeReactionButtons = ({
  likes = 0,
  dislikes = 0,
  userReaction = null,
  onLike,
  onDislike,
  size = 'medium', // 'small' | 'medium'
  isDarkMode = false
}) => {
  const isLiked = userReaction === 'like';
  const isDisliked = userReaction === 'dislike';

  return (
    <div className={`yt-reactions-container ${size} ${isDarkMode ? 'dark' : 'light'}`}>
      <button
        type="button"
        className={`yt-reaction-btn yt-like-btn ${isLiked ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (onLike) onLike();
        }}
        title={isLiked ? 'Unlike' : 'Like'}
        aria-label="Like"
      >
        <svg
          className="yt-icon yt-thumb-up"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill={isLiked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={isLiked ? '0' : '1.8'}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isLiked ? (
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
          ) : (
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          )}
        </svg>
        <span className="yt-count">{likes}</span>
      </button>

      <span className="yt-separator" aria-hidden="true">/</span>

      <button
        type="button"
        className={`yt-reaction-btn yt-dislike-btn ${isDisliked ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (onDislike) onDislike();
        }}
        title={isDisliked ? 'Remove dislike' : 'Dislike'}
        aria-label="Dislike"
      >
        <svg
          className="yt-icon yt-thumb-down"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill={isDisliked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={isDisliked ? '0' : '1.8'}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isDisliked ? (
            <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
          ) : (
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
          )}
        </svg>
        {dislikes > 0 && <span className="yt-count">{dislikes}</span>}
      </button>
    </div>
  );
};

export default YouTubeReactionButtons;
