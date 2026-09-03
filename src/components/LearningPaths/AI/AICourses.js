import React from 'react';
import CourseRecommendations from '../../FieldSections/CourseRecommendations';

const AICourses = ({ courses }) => {
  return (
    <div className="ai-courses-wrapper">
      <CourseRecommendations courses={courses} />
    </div>
  );
};

export default AICourses;
