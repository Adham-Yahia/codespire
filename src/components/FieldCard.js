import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../i18n/i18n';

const FieldCard = ({ field, onSelect }) => {
  const { language } = useLanguage();
  
  // Get translated field name if available
  const getFieldName = () => {
    if (field.id === 'ai') return t('fields.ai.name', language);
    if (field.id === 'dataScience') return t('fields.dataScience.name', language);
    return field.name;
  };

  const getFieldDescription = () => {
    if (field.id === 'ai') return t('fields.ai.description', language);
    if (field.id === 'dataScience') return t('fields.dataScience.description', language);
    return field.description;
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title className="fw-bold">{getFieldName()}</Card.Title>
        <Card.Text className="text-muted">
          {getFieldDescription().substring(0, 150)}...
        </Card.Text>
        <Button variant="primary" onClick={() => onSelect(field.id)}>
          {language === 'ar' ? 'استكشف المجال' : 'Explore Field'}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FieldCard;