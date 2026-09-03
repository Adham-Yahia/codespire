import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/i18n';
import ComprehensiveStats from './FieldSections/ComprehensiveStats';
import CareerOpportunities from './FieldSections/CareerOpportunities';
import FieldCommunityComments from './FieldSections/FieldCommunityComments';
import { AIRoadmap, AISkills, AICourses } from './LearningPaths/AI';
import { DataScienceRoadmap, DataScienceSkills, DataScienceCourses } from './LearningPaths/DataScience';
import './FieldDetail.css';

const FieldDetail = ({ field, onBack }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const [fieldComments, setFieldComments] = useState([]);

  const handleAddComment = (commentText) => {
    const newComment = {
      id: fieldComments.length + 1,
      user: 'You',
      text: commentText,
      date: new Date().toISOString().split('T')[0],
      canEdit: true
    };
    setFieldComments([newComment, ...fieldComments]);
  };

  const handleDeleteComment = (commentId) => {
    setFieldComments(fieldComments.filter(c => c.id !== commentId));
  };

  const handleEditComment = (commentId, newText) => {
    setFieldComments(fieldComments.map(c => 
      c.id === commentId ? { ...c, text: newText, edited: true } : c
    ));
  };

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

      {/* Learning Path Components */}
      {getSkillsComponent()}
      {getRoadmapComponent()}
      {getCoursesComponent()}

      <FieldCommunityComments 
        comments={fieldComments}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onEditComment={handleEditComment}
      />
    </Container>
  );
};

export default FieldDetail;