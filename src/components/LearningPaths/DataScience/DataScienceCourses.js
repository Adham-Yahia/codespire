import React from 'react';
import CourseRecommendations from '../../FieldSections/CourseRecommendations';

const DataScienceCourses = ({ courses }) => {
  return (
    <div className="data-science-courses-wrapper">
      <CourseRecommendations courses={courses} />
    </div>
  );
};

export default DataScienceCourses;
