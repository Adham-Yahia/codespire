import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/i18n';
import CommentForm from './CommunitySections/CommentForm';
import CommentList from './CommunitySections/CommentList';
import { communityComments } from '../data/fieldData';
import './Community.css';

const Community = () => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const [comments, setComments] = useState(communityComments);
  const [selectedField, setSelectedField] = useState('all');

  const filteredComments = selectedField === 'all' 
    ? comments 
    : comments.filter(comment => comment.field === selectedField);

  const handleAddComment = (commentData) => {
    const newComment = {
      id: Math.max(0, ...comments.map(c => c.id), 0) + 1,
      user: 'You',
      field: commentData.field,
      text: commentData.text,
      date: new Date().toISOString().split('T')[0],
      canEdit: true
    };
    setComments([newComment, ...comments]);
  };

  const handleDeleteComment = (commentId) => {
    setComments(comments.filter(c => c.id !== commentId));
  };

  const handleEditComment = (commentId, newText) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, text: newText, edited: true } : c
    ));
  };

  const handleFieldChange = (field) => {
    setSelectedField(field);
  };

  const stats = {
    total: comments.length,
    ai: comments.filter(c => c.field === 'ai').length,
    dataScience: comments.filter(c => c.field === 'dataScience').length
  };

  return (
    <div className={`community-page ${isDarkMode ? 'dark' : 'light'}`}>
      <Container className="py-5">
        {/* Hero Section */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h1 className={`community-title ${isDarkMode ? 'text-light' : ''}`}>
              💬 {t('community.title', language)}
            </h1>
            <p className={`community-subtitle ${isDarkMode ? 'text-muted' : 'text-secondary'}`}>
              {language === 'ar' ? 'تواصل مع متعلمين آخرين، شارك رحلتك، وساعد الآخرين في التنقل عبر مسارات حياتهم المهنية' : 'Connect with fellow learners, share your journey, and help others navigate their career paths'}
            </p>
          </Col>
        </Row>

        {/* Stats Section */}
        <Row className="mb-4">
          <Col xs={4} sm={4} md={3} lg={2} className="mb-2 mb-md-0">
            <div className={`stat-card ${isDarkMode ? 'dark' : ''}`}>
              <div className="stat-number">{stats.total}</div>
              <div className={`stat-label ${isDarkMode ? 'text-muted' : 'text-secondary'}`}>
                {t('community.discussions', language)}
              </div>
            </div>
          </Col>
          <Col xs={4} sm={4} md={3} lg={2} className="mb-2 mb-md-0">
            <div className={`stat-card ${isDarkMode ? 'dark' : ''}`}>
              <div className="stat-number">{stats.ai}</div>
              <div className={`stat-label ${isDarkMode ? 'text-muted' : 'text-secondary'}`}>
                {t('fields.ai.name', language)}
              </div>
            </div>
          </Col>
          <Col xs={4} sm={4} md={3} lg={2} className="mb-2 mb-md-0">
            <div className={`stat-card ${isDarkMode ? 'dark' : ''}`}>
              <div className="stat-number">{stats.dataScience}</div>
              <div className={`stat-label ${isDarkMode ? 'text-muted' : 'text-secondary'}`}>
                {t('fields.dataScience.name', language)}
              </div>
            </div>
          </Col>
        </Row>

        {/* Comment Form */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <CommentForm 
              selectedField={selectedField}
              onFieldChange={handleFieldChange}
              onSubmit={handleAddComment}
            />
          </Col>
        </Row>

        {/* Filter Section */}
        <Row className="mb-4">
          <Col lg={10} className="mx-auto">
            <div className={`filter-section ${isDarkMode ? 'dark' : ''}`}>
              <span className={`filter-label ${isDarkMode ? 'text-light' : ''}`}>
                {language === 'ar' ? 'تصفية حسب الفئة:' : 'Filter by Category:'}
              </span>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${selectedField === 'all' ? 'active' : ''} ${isDarkMode ? 'dark' : ''}`}
                  onClick={() => setSelectedField('all')}
                >
                  {language === 'ar' ? 'جميع النقاشات' : 'All Discussions'} ({stats.total})
                </button>
                <button
                  className={`filter-btn ${selectedField === 'ai' ? 'active' : ''} ${isDarkMode ? 'dark' : ''}`}
                  onClick={() => setSelectedField('ai')}
                >
                  {t('fields.ai.name', language)} ({stats.ai})
                </button>
                <button
                  className={`filter-btn ${selectedField === 'dataScience' ? 'active' : ''} ${isDarkMode ? 'dark' : ''}`}
                  onClick={() => setSelectedField('dataScience')}
                >
                  {t('fields.dataScience.name', language)} ({stats.dataScience})
                </button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Comments List */}
        <Row>
          <Col lg={10} className="mx-auto">
            <CommentList
              comments={filteredComments}
              onDeleteComment={handleDeleteComment}
              onEditComment={handleEditComment}
              selectedField={selectedField}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Community;