/**
 * Community.js
 * ------------
 * Live community page — fetches posts from the database and lets
 * authenticated users create, edit, and delete their own posts.
 *
 * Uses communityService (→ /api/posts) for all data operations.
 * Falls back gracefully when the backend is unavailable.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTheme }    from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth }     from '../context/AuthContext';
import { t }           from '../i18n/i18n';
import communityService from '../services/community';
import CommentForm from './CommunitySections/CommentForm';
import CommentList from './CommunitySections/CommentList';
import './Community.css';

const Community = () => {
  const { isDarkMode }     = useTheme();
  const { language }       = useLanguage();
  const { isAuthenticated, user } = useAuth();

  const [posts,         setPosts]         = useState([]);
  const [selectedField, setSelectedField] = useState('all');
  const [loading,       setLoading]       = useState(true);
  const [apiError,      setApiError]      = useState('');
  const [mentionUsers,  setMentionUsers]  = useState([]);

  // ── Fetch mentionable users ──────────────────────────────────────────────
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await communityService.getUsers();
        if (res.data) setMentionUsers(res.data);
      } catch (err) {
        // Fallback gracefully to authors in posts
      }
    };
    loadUsers();
  }, []);

  // ── Fetch posts from the backend ─────────────────────────────────────────

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const res = await communityService.getPosts(selectedField);
      // Add `canEdit` flag: true only for the post's author
      const withFlags = (res.data || []).map(p => ({
        ...p,
        canEdit: isAuthenticated && user && p.authorId?.toString() === user._id?.toString()
      }));
      setPosts(withFlags);
    } catch (err) {
      setApiError(err.message || 'Failed to load posts.');
    } finally {
      setLoading(false);
    }
  }, [selectedField, isAuthenticated, user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ── Helpers for Optimistic Updates ───────────────────────────────────────

  const toggleReaction = (item, reactionType) => {
    const current = item.userReaction;
    let nextReaction = null;
    let likes = item.likes || 0;
    let dislikes = item.dislikes || 0;

    if (reactionType === 'like') {
      if (current === 'like') {
        nextReaction = null;
        likes = Math.max(0, likes - 1);
      } else if (current === 'dislike') {
        nextReaction = 'like';
        likes = likes + 1;
        dislikes = Math.max(0, dislikes - 1);
      } else {
        nextReaction = 'like';
        likes = likes + 1;
      }
    } else if (reactionType === 'dislike') {
      if (current === 'dislike') {
        nextReaction = null;
        dislikes = Math.max(0, dislikes - 1);
      } else if (current === 'like') {
        nextReaction = 'dislike';
        dislikes = dislikes + 1;
        likes = Math.max(0, likes - 1);
      } else {
        nextReaction = 'dislike';
        dislikes = dislikes + 1;
      }
    }

    return {
      ...item,
      likes,
      dislikes,
      userReaction: nextReaction
    };
  };

  const updateReplyReactionRecursively = (replies, targetReplyId, reactionType) => {
    return (replies || []).map(r => {
      if (r._id === targetReplyId || r.id === targetReplyId) {
        return toggleReaction(r, reactionType);
      }
      if (r.replies && r.replies.length > 0) {
        return {
          ...r,
          replies: updateReplyReactionRecursively(r.replies, targetReplyId, reactionType)
        };
      }
      return r;
    });
  };

  const insertReplyRecursively = (replies, targetParentId, newReply) => {
    if (!targetParentId) {
      return [...(replies || []), newReply];
    }
    return (replies || []).map(r => {
      if (r._id === targetParentId || r.id === targetParentId) {
        return {
          ...r,
          replies: [...(r.replies || []), newReply]
        };
      }
      if (r.replies && r.replies.length > 0) {
        return {
          ...r,
          replies: insertReplyRecursively(r.replies, targetParentId, newReply)
        };
      }
      return r;
    });
  };

  // ── Mutations with Zero-Latency Optimistic UI ───────────────────────────

  const handleAddComment = async (commentData) => {
    if (!isAuthenticated) {
      setApiError('You must be signed in to post a comment.');
      return;
    }

    const tempId = `temp-post-${Date.now()}`;
    const optimisticPost = {
      _id: tempId,
      id: tempId,
      user: user?.name || 'You',
      authorId: user?._id,
      field: commentData.field === 'all' ? 'ai' : commentData.field,
      text: commentData.text,
      date: new Date().toISOString().split('T')[0],
      edited: false,
      canEdit: true,
      likes: 0,
      dislikes: 0,
      userReaction: null,
      replies: []
    };

    // Instant update
    setPosts(prev => [optimisticPost, ...prev]);

    try {
      const res = await communityService.createPost(
        commentData.text,
        commentData.field === 'all' ? 'ai' : commentData.field
      );
      const realPost = { ...res.data, canEdit: true };
      setPosts(prev => prev.map(p => (p._id === tempId || p.id === tempId ? realPost : p)));
    } catch (err) {
      // Rollback on error
      setPosts(prev => prev.filter(p => p._id !== tempId && p.id !== tempId));
      setApiError(err.message || 'Failed to post comment.');
    }
  };

  const handleDeleteComment = async (postId) => {
    const snapshot = posts;
    setPosts(prev => prev.filter(p => p._id !== postId && p.id !== postId));
    try {
      await communityService.deletePost(postId);
    } catch (err) {
      setPosts(snapshot);
      setApiError(err.message || 'Failed to delete post.');
    }
  };

  const handleEditComment = async (postId, newText) => {
    const snapshot = posts;
    setPosts(prev => prev.map(p => (p._id === postId || p.id === postId ? { ...p, text: newText, edited: true } : p)));
    try {
      const res = await communityService.updatePost(postId, newText);
      const updated = { ...res.data, canEdit: true };
      setPosts(prev => prev.map(p => (p._id === postId || p.id === postId ? updated : p)));
    } catch (err) {
      setPosts(snapshot);
      setApiError(err.message || 'Failed to edit post.');
    }
  };

  const handleAddReply = async (postId, text, parentReplyId = null) => {
    if (!isAuthenticated) {
      setApiError('You must be signed in to post a reply.');
      return;
    }

    // Optimistic UI update for reply (any depth)
    const tempReplyId = `temp-reply-${Date.now()}`;
    const tempReply = {
      _id: tempReplyId,
      id: tempReplyId,
      user: user?.name || 'You',
      authorId: user?._id,
      text: text,
      date: new Date().toISOString().split('T')[0],
      edited: false,
      canEdit: true,
      likes: 0,
      dislikes: 0,
      userReaction: null,
      parentReplyId: parentReplyId || null,
      replies: []
    };

    setPosts(prev => prev.map(p => {
      if (p._id !== postId && p.id !== postId) return p;
      return {
        ...p,
        replies: insertReplyRecursively(p.replies || [], parentReplyId, tempReply)
      };
    }));

    try {
      const res = await communityService.addReply(postId, text, parentReplyId);
      const updated = { ...res.data, canEdit: true };
      setPosts(prev => prev.map(p => (p._id === postId || p.id === postId ? updated : p)));
    } catch (err) {
      fetchPosts();
      setApiError(err.message || 'Failed to post reply.');
    }
  };

  const handleDeleteReply = async (postId, replyId) => {
    const snapshot = posts;
    // Optimistically remove reply
    const removeReplyRecursively = (replies, targetId) => {
      return (replies || [])
        .filter(r => r._id !== targetId && r.id !== targetId)
        .map(r => ({
          ...r,
          replies: removeReplyRecursively(r.replies || [], targetId)
        }));
    };

    setPosts(prev => prev.map(p => {
      if (p._id !== postId && p.id !== postId) return p;
      return {
        ...p,
        replies: removeReplyRecursively(p.replies || [], replyId)
      };
    }));

    try {
      const res = await communityService.deleteReply(postId, replyId);
      const updated = { ...res.data, canEdit: true };
      setPosts(prev => prev.map(p => (p._id === postId || p.id === postId ? updated : p)));
    } catch (err) {
      setPosts(snapshot);
      setApiError(err.message || 'Failed to delete reply.');
    }
  };

  const handleLikeComment = async (postId) => {
    if (!isAuthenticated) {
      setApiError('You must be signed in to like comments.');
      return;
    }

    const snapshot = posts;
    setPosts(prev => prev.map(p => {
      if (p._id !== postId && p.id !== postId) return p;
      return toggleReaction(p, 'like');
    }));

    try {
      const res = await communityService.likePost(postId);
      const updated = { ...res.data, canEdit: true };
      setPosts(prev => prev.map(p => (p._id === postId || p.id === postId ? updated : p)));
    } catch (err) {
      setPosts(snapshot);
      setApiError(err.message || 'Failed to like comment.');
    }
  };

  const handleDislikeComment = async (postId) => {
    if (!isAuthenticated) {
      setApiError('You must be signed in to dislike comments.');
      return;
    }

    const snapshot = posts;
    setPosts(prev => prev.map(p => {
      if (p._id !== postId && p.id !== postId) return p;
      return toggleReaction(p, 'dislike');
    }));

    try {
      const res = await communityService.dislikePost(postId);
      const updated = { ...res.data, canEdit: true };
      setPosts(prev => prev.map(p => (p._id === postId || p.id === postId ? updated : p)));
    } catch (err) {
      setPosts(snapshot);
      setApiError(err.message || 'Failed to dislike comment.');
    }
  };

  const handleLikeReply = async (postId, replyId) => {
    if (!isAuthenticated) {
      setApiError('You must be signed in to like replies.');
      return;
    }

    const snapshot = posts;
    setPosts(prev => prev.map(p => {
      if (p._id !== postId && p.id !== postId) return p;
      return {
        ...p,
        replies: updateReplyReactionRecursively(p.replies || [], replyId, 'like')
      };
    }));

    try {
      const res = await communityService.likeReply(postId, replyId);
      const updated = { ...res.data, canEdit: true };
      setPosts(prev => prev.map(p => (p._id === postId || p.id === postId ? updated : p)));
    } catch (err) {
      setPosts(snapshot);
      setApiError(err.message || 'Failed to like reply.');
    }
  };

  const handleDislikeReply = async (postId, replyId) => {
    if (!isAuthenticated) {
      setApiError('You must be signed in to dislike replies.');
      return;
    }

    const snapshot = posts;
    setPosts(prev => prev.map(p => {
      if (p._id !== postId && p.id !== postId) return p;
      return {
        ...p,
        replies: updateReplyReactionRecursively(p.replies || [], replyId, 'dislike')
      };
    }));

    try {
      const res = await communityService.dislikeReply(postId, replyId);
      const updated = { ...res.data, canEdit: true };
      setPosts(prev => prev.map(p => (p._id === postId || p.id === postId ? updated : p)));
    } catch (err) {
      setPosts(snapshot);
      setApiError(err.message || 'Failed to dislike reply.');
    }
  };

  // ── Available users for mentions (@) ────────────────────────────────────
  const allMentionUsers = React.useMemo(() => {
    const userMap = new Map();
    mentionUsers.forEach(u => userMap.set(u.name.toLowerCase(), u));
    if (user?.name) {
      userMap.set(user.name.toLowerCase(), { _id: user._id, name: user.name });
    }
    const addFromReplies = (replies) => {
      (replies || []).forEach(r => {
        if (r.user && !userMap.has(r.user.toLowerCase())) {
          userMap.set(r.user.toLowerCase(), { _id: r.authorId || r._id, name: r.user });
        }
        if (r.replies) addFromReplies(r.replies);
      });
    };
    posts.forEach(p => {
      if (p.user && !userMap.has(p.user.toLowerCase())) {
        userMap.set(p.user.toLowerCase(), { _id: p.authorId || p._id, name: p.user });
      }
      if (p.replies) addFromReplies(p.replies);
    });
    return Array.from(userMap.values());
  }, [mentionUsers, user, posts]);

  // ── Derived stats ────────────────────────────────────────────────────────

  const filteredPosts = selectedField === 'all'
    ? posts
    : posts.filter(p => p.field === selectedField);

  const stats = {
    total:       posts.length,
    ai:          posts.filter(p => p.field === 'ai').length,
    dataScience: posts.filter(p => p.field === 'dataScience').length
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={`community-page ${isDarkMode ? 'dark' : 'light'}`}>
      <Container className="py-5">

        {/* Hero */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h1 className={`community-title ${isDarkMode ? 'text-light' : ''}`}>
              💬 {t('community.title', language)}
            </h1>
            <p className={`community-subtitle ${isDarkMode ? 'text-muted' : 'text-secondary'}`}>
              {language === 'ar'
                ? 'تواصل مع متعلمين آخرين، شارك رحلتك، وساعد الآخرين في التنقل عبر مسارات حياتهم المهنية'
                : 'Connect with fellow learners, share your journey, and help others navigate their career paths'}
            </p>
          </Col>
        </Row>

        {/* Stats */}
        <Row className="mb-4">
          {[
            { label: t('community.discussions', language), value: stats.total },
            { label: t('fields.ai.name', language),        value: stats.ai },
            { label: t('fields.dataScience.name', language), value: stats.dataScience }
          ].map(({ label, value }) => (
            <Col key={label} xs={4} sm={4} md={3} lg={2} className="mb-2 mb-md-0">
              <div className={`stat-card ${isDarkMode ? 'dark' : ''}`}>
                <div className="stat-number">{value}</div>
                <div className={`stat-label ${isDarkMode ? 'text-muted' : 'text-secondary'}`}>
                  {label}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* API error banner */}
        {apiError && (
          <Row className="mb-3">
            <Col lg={10} className="mx-auto">
              <div
                style={{
                  background: 'rgba(255,92,124,0.1)',
                  border: '1px solid rgba(255,92,124,0.35)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: '#ff8fa3',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                ⚠️ {apiError}
                <button
                  onClick={() => setApiError('')}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            </Col>
          </Row>
        )}

        {/* Auth notice for guests */}
        {!isAuthenticated && (
          <Row className="mb-4">
            <Col lg={10} className="mx-auto">
              <div
                style={{
                  background: isDarkMode ? 'rgba(108,99,255,0.08)' : 'rgba(108,99,255,0.06)',
                  border: '1px solid rgba(108,99,255,0.25)',
                  borderRadius: '12px',
                  padding: '0.9rem 1.2rem',
                  color: isDarkMode ? '#a89fff' : '#5a53cc',
                  fontSize: '0.88rem'
                }}
              >
                💡 <strong>Sign in</strong> to post comments, edit, or delete your own posts.
              </div>
            </Col>
          </Row>
        )}

        {/* Comment Form */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <CommentForm
              selectedField={selectedField}
              onFieldChange={setSelectedField}
              onSubmit={handleAddComment}
              disabled={!isAuthenticated}
              availableUsers={allMentionUsers}
            />
          </Col>
        </Row>

        {/* Filter */}
        <Row className="mb-4">
          <Col lg={10} className="mx-auto">
            <div className={`filter-section ${isDarkMode ? 'dark' : ''}`}>
              <span className={`filter-label ${isDarkMode ? 'text-light' : ''}`}>
                {language === 'ar' ? 'تصفية حسب الفئة:' : 'Filter by Category:'}
              </span>
              <div className="filter-buttons">
                {[
                  { key: 'all',         label: `${language === 'ar' ? 'جميع النقاشات' : 'All Discussions'} (${stats.total})` },
                  { key: 'ai',          label: `${t('fields.ai.name', language)} (${stats.ai})` },
                  { key: 'dataScience', label: `${t('fields.dataScience.name', language)} (${stats.dataScience})` }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    className={`filter-btn ${selectedField === key ? 'active' : ''} ${isDarkMode ? 'dark' : ''}`}
                    onClick={() => setSelectedField(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Posts list */}
        <Row>
          <Col lg={10} className="mx-auto">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: isDarkMode ? 'rgba(255,255,255,0.4)' : '#aaa' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                Loading discussions…
              </div>
            ) : (
              <CommentList
                comments={filteredPosts}
                onDeleteComment={handleDeleteComment}
                onEditComment={handleEditComment}
                onAddReply={handleAddReply}
                onDeleteReply={handleDeleteReply}
                onLikeComment={handleLikeComment}
                onDislikeComment={handleDislikeComment}
                onLikeReply={handleLikeReply}
                onDislikeReply={handleDislikeReply}
                availableUsers={allMentionUsers}
                selectedField={selectedField}
              />
            )}
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default Community;