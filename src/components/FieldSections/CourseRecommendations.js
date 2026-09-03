import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';
import './CourseRecommendations.css';

const CourseRecommendations = ({ courses }) => {
  const { isDarkMode } = useTheme();

  return (
    <Row className="mb-5">
      <Col>
        <h2 className="mb-4 fw-bold">Recommended Courses</h2>
        <Row>
          {courses.map((course, index) => (
            <Col md={6} lg={4} key={index} className="mb-4">
              <Card 
                className={`course-card h-100 ${isDarkMode ? 'dark' : 'light'}`}
              >
                <Card.Body>
                  <div className="course-header">
                    <Card.Title className="fw-bold">{course.name}</Card.Title>
                    <span className="platform-badge">{course.platform}</span>
                  </div>
                  
                  <Card.Subtitle className={`mb-3 ${isDarkMode ? 'text-light' : 'text-muted'}`}>Topics</Card.Subtitle>
                  
                  <div className="topics-list">
                    {course.topics.map((topic, topicIndex) => (
                      <span key={topicIndex} className={`topic-tag ${isDarkMode ? 'dark' : ''}`}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </Card.Body>
                
                <div className="course-footer">
                  <small className={isDarkMode ? 'text-light' : 'text-muted'}>Recommended for learners at all levels</small>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default CourseRecommendations;
