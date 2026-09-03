import React from 'react';
import EssentialSkills from '../../FieldSections/EssentialSkills';

const AISkills = ({ skills }) => {
  return (
    <div className="ai-skills-wrapper">
      <EssentialSkills skills={skills} />
    </div>
  );
};

export default AISkills;
