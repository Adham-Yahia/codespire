import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';
import './EssentialSkills.css';

const EssentialSkills = ({ skills }) => {
  const { isDarkMode } = useTheme();

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'advanced':
        return 'danger';
      case 'intermediate':
        return 'warning';
      case 'beginner':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <Row className="mb-5">
      <Col>
        <h2 className="mb-4 fw-bold">Essential Skills</h2>
        <div className="skills-container">
          {skills.map((skill, index) => (
            <div key={index} className={`skill-badge ${isDarkMode ? 'dark' : 'light'}`}>
              <Badge 
                bg={getLevelColor(skill.level)} 
                className="skill-badge-content"
              >
                <span className="skill-name">{skill.name}</span>
                <span className="skill-level">({skill.level})</span>
              </Badge>
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default EssentialSkills;
