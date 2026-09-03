import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import Hero from './components/Hero';
import FieldCard from './components/FieldCard';
import FieldDetail from './components/FieldDetail';
import Community from './components/Community';
import Footer from './components/Footer';
import { fieldData } from './data/fieldData';
import './components/DarkMode.css';

function App() {
  const [selectedField, setSelectedField] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  const handleFieldSelect = (fieldId) => {
    setSelectedField(fieldId);
    setCurrentPage('fieldDetail');
  };

  const handleBackToFields = () => {
    setSelectedField(null);
    setCurrentPage('home');
  };

  const handleNavClick = (page) => {
    if (page === 'ai' || page === 'dataScience') {
      setSelectedField(page);
      setCurrentPage('fieldDetail');
    } else {
      setCurrentPage(page);
      setSelectedField(null);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onFieldSelect={handleFieldSelect} fields={Object.values(fieldData)} />
            <Container className="py-5">
              <h2 className="text-center mb-5 fw-bold">Explore Your Path</h2>
              <Row>
                {Object.values(fieldData).map((field) => (
                  <Col key={field.id} md={6} className="mb-4">
                    <FieldCard field={field} onSelect={handleFieldSelect} />
                  </Col>
                ))}
              </Row>
            </Container>
          </>
        );
      case 'fieldDetail':
        return selectedField ? (
          <FieldDetail 
            field={fieldData[selectedField]} 
            onBack={handleBackToFields} 
          />
        ) : null;
      case 'community':
        return <Community />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <Header onNavClick={handleNavClick} />
      <main>
        {renderContent()}
      </main>
      <Footer onNavClick={handleNavClick} />
    </div>
  );
}

export default App;