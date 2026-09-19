import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { t } from '../i18n/i18n';
import ComprehensiveStats from './FieldSections/ComprehensiveStats';
import CareerOpportunities from './FieldSections/CareerOpportunities';
import FieldCommunityComments from './FieldSections/FieldCommunityComments';
import { AIRoadmap, AISkills, AICourses } from './LearningPaths/AI';
import { DataScienceRoadmap, DataScienceSkills, DataScienceCourses } from './LearningPaths/DataScience';
import communityService from '../services/community';
import './FieldDetail.css';

const FieldDetail = ({ field, onBack }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [fieldComments, setFieldComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [mentionUsers, setMentionUsers] = useState([]);

  // Fetch mentionable users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await communityService.getUsers();
        if (res.data) setMentionUsers(res.data);
      } catch (err) {
        // Fallback gracefully
      }
    };
    loadUsers();
  }, []);

  // Fetch comments from backend
  const fetchComments = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const res = await communityService.getPosts(field.id);
      const withFlags = (res.data || []).map(p => ({
        ...p,
        canEdit: isAuthenticated && user && p.authorId?.toString() === user._id?.toString()
      }));
      setFieldComments(withFlags);
    } catch (err) {
      setApiError(err.message || 'Failed to load comments.');
    } finally {
      setLoading(false);
    }
  }, [field.id, isAuthenticated, user]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // ── Reaction and Nesting Helpers ──────────────────────────────────────────

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

  const handleAddComment = async (commentText) => {
    if (!isAuthenticated) {
      setApiError('You must be signed in to post a comment.');
      return;
    }

    const tempId = `temp-comment-${Date.now()}`;
    const optimisticComment = {
      _id: tempId,
      id: tempId,
      user: user?.name || 'You',
      authorId: user?._id,
      field: field.id,
      text: commentText,
      date: new Date().toISOString().split('T')[0],
      edited: false,
      canEdit: true,
      likes: 0,
      dislikes: 0,
      userReaction: null,
      replies: []
    };

    setFieldComments(prev => [optimisticComment, ...prev]);

    try {
      const res = await communityService.createPost(commentText, field.id);
      const newComment = { ...res.data, canEdit: true };
      setFieldComments(prev => prev.map(c => (c._id === tempId || c.id === tempId ? newComment : c)));
    } catch (err) {
      setFieldComments(prev => prev.filter(c => c._id !== tempId && c.id !== tempId));
      setApiError(err.message || 'Failed to post comment.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const snapshot = fieldComments;
    setFieldComments(prev => prev.filter(c => c._id !== commentId && c.id !== commentId));
    try {
      await communityService.deletePost(commentId);
    } catch (err) {
      setFieldComments(snapshot);
      setApiError(err.message || 'Failed to delete comment.');
    }
  };

  const handleEditComment = async (commentId, newText) => {
    const snapshot = fieldComments;
    setFieldComments(prev => prev.map(c => (c._id === commentId || c.id === commentId ? { ...c, text: newText, edited: true } : c)));
    try {
      const res = await communityService.updatePost(commentId, newText);
      const updated = { ...res.data, canEdit: true };
      setFieldComments(prev => prev.map(c => (c._id === commentId || c.id === commentId ? updated : c)));
    } catch (err) {
      setFieldComments(snapshot);
      setApiError(err.message || 'Failed to edit comment.');
    }
  };

  const handleAddReply = async (commentId, replyText, parentReplyId = null) => {
    if (!isAuthenticated) {
      setApiError('You must be signed in to post a reply.');
      return;
    }

    const tempReplyId = `temp-reply-${Date.now()}`;
    const tempReply = {
      _id: tempReplyId,
      id: tempReplyId,
      user: user?.name || 'You',
      authorId: user?._id,
      text: replyText,
      date: new Date().toISOString().split('T')[0],
      edited: false,
      canEdit: true,
      likes: 0,
      dislikes: 0,
      userReaction: null,
      parentReplyId: parentReplyId || null,
      replies: []
    };

    setFieldComments(prev => prev.map(c => {
      if (c._id !== commentId && c.id !== commentId) return c;
      return {
        ...c,
        replies: insertReplyRecursively(c.replies || [], parentReplyId, tempReply)
      };
    }));

    try {
      const res = await communityService.addReply(commentId, replyText, parentReplyId);
      const updated = { ...res.data, canEdit: true };
      setFieldComments(prev => prev.map(c => (c._id === commentId || c.id === commentId ? updated : c)));
    } catch (err) {
      fetchComments();
      setApiError(err.message || 'Failed to post reply.');
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    const snapshot = fieldComments;
    const removeReplyRecursively = (replies, targetId) => {
      return (replies || [])
        .filter(r => r._id !== targetId && r.id !== targetId)
        .map(r => ({
          ...r,
          replies: removeReplyRecursively(r.replies || [], targetId)
        }));
    };

    setFieldComments(prev => prev.map(c => {
      if (c._id !== commentId && c.id !== commentId) return c;
      return {
        ...c,
        replies: removeReplyRecursively(c.replies || [], replyId)
      };
    }));

    try {
      const res = await communityService.deleteReply(commentId, replyId);
      const updated = { ...res.data, canEdit: true };
      setFieldComments(prev => prev.map(c => (c._id === commentId || c.id === commentId ? updated : c)));
    } catch (err) {
      setFieldComments(snapshot);
      setApiError(err.message || 'Failed to delete reply.');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) {
      setApiError('You must be signed in to like comments.');
      return;
    }

    const snapshot = fieldComments;
    setFieldComments(prev => prev.map(c => {
      if (c._id !== commentId && c.id !== commentId) return c;
      return toggleReaction(c, 'like');
    }));

    try {
      const res = await communityService.likePost(commentId);
      const updated = { ...res.data, canEdit: true };
      setFieldComments(prev => prev.map(c => (c._id === commentId || c.id === commentId ? updated : c)));
    } catch (err) {
      setFieldComments(snapshot);
      setApiError(err.message || 'Failed to like comment.');
    }
  };

  const handleDislikeComment = async (commentId) => {
    if (!isAuthenticated) {
      setApiError('You must be signed in to dislike comments.');
      return;
    }

    const snapshot = fieldComments;
    setFieldComments(prev => prev.map(c => {
      if (c._id !== commentId && c.id !== commentId) return c;
      return toggleReaction(c, 'dislike');
    }));

    try {
      const res = await communityService.dislikePost(commentId);
      const updated = { ...res.data, canEdit: true };
      setFieldComments(prev => prev.map(c => (c._id === commentId || c.id === commentId ? updated : c)));
    } catch (err) {
      setFieldComments(snapshot);
      setApiError(err.message || 'Failed to dislike comment.');
    }
  };

  const handleLikeReply = async (commentId, replyId) => {
    if (!isAuthenticated) {
      setApiError('You must be signed in to like replies.');
      return;
    }

    const snapshot = fieldComments;
    setFieldComments(prev => prev.map(c => {
      if (c._id !== commentId && c.id !== commentId) return c;
      return {
        ...c,
        replies: updateReplyReactionRecursively(c.replies || [], replyId, 'like')
      };
    }));

    try {
      const res = await communityService.likeReply(commentId, replyId);
      const updated = { ...res.data, canEdit: true };
      setFieldComments(prev => prev.map(c => (c._id === commentId || c.id === commentId ? updated : c)));
    } catch (err) {
      setFieldComments(snapshot);
      setApiError(err.message || 'Failed to like reply.');
    }
  };

  const handleDislikeReply = async (commentId, replyId) => {
    if (!isAuthenticated) {
      setApiError('You must be signed in to dislike replies.');
      return;
    }

    const snapshot = fieldComments;
    setFieldComments(prev => prev.map(c => {
      if (c._id !== commentId && c.id !== commentId) return c;
      return {
        ...c,
        replies: updateReplyReactionRecursively(c.replies || [], replyId, 'dislike')
      };
    }));

    try {
      const res = await communityService.dislikeReply(commentId, replyId);
      const updated = { ...res.data, canEdit: true };
      setFieldComments(prev => prev.map(c => (c._id === commentId || c.id === commentId ? updated : c)));
    } catch (err) {
      setFieldComments(snapshot);
      setApiError(err.message || 'Failed to dislike reply.');
    }
  };

  // Available users for mentions
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
    fieldComments.forEach(p => {
      if (p.user && !userMap.has(p.user.toLowerCase())) {
        userMap.set(p.user.toLowerCase(), { _id: p.authorId || p._id, name: p.user });
      }
      if (p.replies) addFromReplies(p.replies);
    });
    return Array.from(userMap.values());
  }, [mentionUsers, user, fieldComments]);

  // Get learning path components based on field type
  const getRoadmapComponent = () => {
    switch (field.id) {
      case 'ai':
        return <AIRoadmap roadmap={field.roadmap} />;
      case 'dataScience':
        return <DataScienceRoadmap roadmap={field.roadmap} />;
      default:
        return null;
    }
  };

  const getSkillsComponent = () => {
    switch (field.id) {
      case 'ai':
        return <AISkills skills={field.skills} />;
      case 'dataScience':
        return <DataScienceSkills skills={field.skills} />;
      default:
        return null;
    }
  };

  const getCoursesComponent = () => {
    switch (field.id) {
      case 'ai':
        return <AICourses courses={field.courses} />;
      case 'dataScience':
        return <DataScienceCourses courses={field.courses} />;
      default:
        return null;
    }
  };

  // Get field name in current language
  const getFieldName = () => {
    if (field.id === 'ai') return t('fields.ai.name', language);
    if (field.id === 'dataScience') return t('fields.dataScience.name', language);
    return field.name;
  };

  const getFieldDescription = () => {
    if (field.id === 'ai') return t('fields.ai.description', language);
    if (field.id === 'dataScience') return t('fields.dataScience.description', language);
    return field.description;
  };

  return (
    <Container className={`field-detail py-4 ${isDarkMode ? 'dark' : ''}`}>
      <Button 
        variant="outline-secondary" 
        onClick={onBack} 
        className="mb-4 back-button"
      >
        ← {t('fieldDetail.back', language)}
      </Button>

      <Row className="mb-4">
        <Col>
          <h1 className={`fw-bold field-title ${isDarkMode ? 'text-light' : ''}`}>
            {getFieldName()}
          </h1>
          <p className={`lead field-description ${isDarkMode ? 'text-light' : ''}`}>
            {getFieldDescription()}
          </p>
        </Col>
      </Row>

      {field.employmentStats && <ComprehensiveStats stats={{
        name: getFieldName(),
        ...field.employmentStats
      }} />}

      <CareerOpportunities opportunities={field.careerOpportunities} />

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

      {/* Learning Path Components */}
      {getSkillsComponent()}
      {getRoadmapComponent()}
      {getCoursesComponent()}

      <FieldCommunityComments 
        comments={fieldComments}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onEditComment={handleEditComment}
        onAddReply={handleAddReply}
        onDeleteReply={handleDeleteReply}
        onLikeComment={handleLikeComment}
        onDislikeComment={handleDislikeComment}
        onLikeReply={handleLikeReply}
        onDislikeReply={handleDislikeReply}
        availableUsers={allMentionUsers}
        loading={loading}
        disabled={!isAuthenticated}
      />
    </Container>
  );
};

export default FieldDetail;