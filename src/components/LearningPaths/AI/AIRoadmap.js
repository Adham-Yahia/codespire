import React from 'react';
import LearningRoadmap from '../../FieldSections/LearningRoadmap';

const AIRoadmap = ({ roadmap }) => {
  return (
    <div className="ai-roadmap-wrapper">
      <LearningRoadmap roadmap={roadmap} />
    </div>
  );
};

export default AIRoadmap;
