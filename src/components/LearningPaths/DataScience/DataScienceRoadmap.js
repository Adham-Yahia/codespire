import React from 'react';
import LearningRoadmap from '../../FieldSections/LearningRoadmap';

const DataScienceRoadmap = ({ roadmap }) => {
  return (
    <div className="data-science-roadmap-wrapper">
      <LearningRoadmap roadmap={roadmap} />
    </div>
  );
};

export default DataScienceRoadmap;
