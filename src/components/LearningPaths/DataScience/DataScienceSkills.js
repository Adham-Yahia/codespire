import React from 'react';
import EssentialSkills from '../../FieldSections/EssentialSkills';

const DataScienceSkills = ({ skills }) => {
  return (
    <div className="data-science-skills-wrapper">
      <EssentialSkills skills={skills} />
    </div>
  );
};

export default DataScienceSkills;
