import React from 'react';
import { Row, Col, Accordion } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';
import './LearningRoadmap.css';

const LearningRoadmap = ({ roadmap }) => {
  const { isDarkMode } = useTheme();

  return (
    <Row className="mb-5">
      <Col>
        <h2 className="mb-4 fw-bold">Learning Roadmap</h2>
        <Accordion defaultActiveKey="0" className={`roadmap-accordion ${isDarkMode ? 'dark' : ''}`}>
          {roadmap.map((phase, index) => (
            <Accordion.Item 
              key={index} 
              eventKey={index.toString()}
              className={isDarkMode ? 'bg-dark border-secondary' : ''}
            >
              <Accordion.Header className={isDarkMode ? 'text-light' : ''}>
                <div className="roadmap-header">
                  <div className="phase-number">{index + 1}</div>
                  <div className="phase-info">
                    <strong className="phase-name">{phase.phase}</strong>
                    <span className="phase-duration">{phase.duration}</span>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body className={isDarkMode ? 'bg-dark text-light' : ''}>
                <h5 className="mb-3 fw-bold">Topics:</h5>
                <ul className="topics-list mb-4">
                  {phase.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="topic-item">{topic}</li>
                  ))}
                </ul>
                
                <h5 className="mb-3 fw-bold">Video Tutorials:</h5>
                <div className="videos-list d-flex flex-column gap-2">
                  {phase.videos.map((video, videoIndex) => (
                    <a
                      key={videoIndex}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`video-link ${isDarkMode ? 'dark' : ''}`}
                    >
                      <span className="video-icon">▶</span>
                      <span className="video-title">{video.title}</span>
                      <span className="video-external">↗</span>
                    </a>
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Col>
    </Row>
  );
};

export default LearningRoadmap;
