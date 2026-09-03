import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { t } from '../../i18n/i18n';
import './CareerOpportunities.css';

const CareerOpportunities = ({ opportunities }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const formatSalary = (salary) => {
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const formatAverage = (value, currency) => {
    return `${currency} ${value.toLocaleString()}`;
  };

  const getHiringRateColor = (rate) => {
    if (rate >= 80) return '#51cf66'; // Green
    if (rate >= 70) return '#ffd43b'; // Yellow
    return '#ff8787'; // Red
  };

  const getHiringRateLabel = (rate) => {
    if (rate >= 80) return language === 'ar' ? 'طلب عالي' : 'High Demand';
    if (rate >= 70) return language === 'ar' ? 'طلب جيد' : 'Good Demand';
    return language === 'ar' ? 'طلب معتدل' : 'Moderate Demand';
  };

  return (
    <Row className="mb-5">
      <Col>
        <div className="section-header">
          <h2 className="section-title">💼 {t('careerOpportunities.title', language)}</h2>
          <p className="section-subtitle">{language === 'ar' ? 'استكشف نطاقات الرواتب عبر مناطق مختلفة ومتوسطات السوق والطلب على التوظيف' : 'Explore salary ranges across different regions, market averages, and hiring demand'}</p>
        </div>

        <div className={`careers-container ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="careers-grid">
            {opportunities.map((career, index) => (
              <div
                key={index}
                className={`career-card ${isDarkMode ? 'dark' : 'light'} ${hoveredIndex === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Card Header */}
                <div className="career-header">
                  <h3 className="career-title">{career.title}</h3>
                  <div className="hiring-rate-badge" style={{ backgroundColor: getHiringRateColor(career.hiringRate) }}>
                    <span className="hiring-rate-label">{getHiringRateLabel(career.hiringRate)}</span>
                    <span className="hiring-rate-value">{career.hiringRate}%</span>
                  </div>
                </div>

                {/* Career Description */}
                <p className="career-description">{career.description}</p>

                {/* Market Average Highlight */}
                {career.marketAverage && (
                  <div className="market-average-section">
                    <span className="market-average-label">💡 {language === 'ar' ? 'متوسط السوق العالمي' : 'Global Market Average'}</span>
                    <span className="market-average-value">USD {career.marketAverage.toLocaleString()}</span>
                  </div>
                )}

                {/* Salaries Grid */}
                <div className="salaries-grid">
                  {/* Egypt */}
                  <div className="salary-column">
                    <div className="region-flag">🇪🇬</div>
                    <div className="region-name">{language === 'ar' ? 'مصر' : 'Egypt'}</div>
                    <div className="salary-range">{formatSalary(career.salaries.egypt)}</div>
                    {career.salaries.egypt.average && (
                      <div className="salary-average">{language === 'ar' ? 'المتوسط:' : 'Avg:'} {formatAverage(career.salaries.egypt.average, 'EGP')}</div>
                    )}
                  </div>

                  {/* GCC */}
                  <div className="salary-column">
                    <div className="region-flag">🏢</div>
                    <div className="region-name">GCC</div>
                    <div className="salary-range">{formatSalary(career.salaries.gcc)}</div>
                    {career.salaries.gcc.average && (
                      <div className="salary-average">{language === 'ar' ? 'المتوسط:' : 'Avg:'} {formatAverage(career.salaries.gcc.average, 'AED')}</div>
                    )}
                  </div>

                  {/* Global */}
                  <div className="salary-column">
                    <div className="region-flag">🌍</div>
                    <div className="region-name">{language === 'ar' ? 'عالمي' : 'Global'}</div>
                    <div className="salary-range">{formatSalary(career.salaries.global)}</div>
                    {career.salaries.global.average && (
                      <div className="salary-average">{language === 'ar' ? 'المتوسط:' : 'Avg:'} {formatAverage(career.salaries.global.average, 'USD')}</div>
                    )}
                  </div>
                </div>

                {/* Salary Comparison Indicator */}
                <div className="salary-comparison">
                  <div className="comparison-bar">
                    <div className="bar-segment egypt" title="Egypt Salary"></div>
                    <div className="bar-segment gcc" title="GCC Salary"></div>
                    <div className="bar-segment global" title="Global Salary"></div>
                  </div>
                </div>

                {/* Hiring Rate Visual Indicator */}
                <div className="hiring-indicator">
                  <div className="hiring-bar-container">
                    <div 
                      className="hiring-bar-fill" 
                      style={{ 
                        width: `${career.hiringRate}%`,
                        backgroundColor: getHiringRateColor(career.hiringRate)
                      }}
                    ></div>
                  </div>
                  <span className="hiring-percentage">{career.hiringRate}% hiring rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className={`careers-legend ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="legend-item">
            <span className="legend-indicator egypt"></span>
            <span className="legend-text">{language === 'ar' ? 'مصر (EGP)' : 'Egypt (EGP)'}</span>
          </div>
          <div className="legend-item">
            <span className="legend-indicator gcc"></span>
            <span className="legend-text">{language === 'ar' ? 'دول الخليج (AED)' : 'GCC Countries (AED)'}</span>
          </div>
          <div className="legend-item">
            <span className="legend-indicator global"></span>
            <span className="legend-text">{language === 'ar' ? 'السوق العالمية (USD)' : 'Global Market (USD)'}</span>
          </div>
          <div className="legend-divider"></div>
          <div className="legend-item">
            <span className="legend-indicator hiring"></span>
            <span className="legend-text">{language === 'ar' ? 'معدل التوظيف' : 'Employment Hiring Rate'}</span>
          </div>
          <div className="legend-item">
            <span className="legend-indicator market-avg"></span>
            <span className="legend-text">{language === 'ar' ? 'متوسط السوق (عالمي)' : 'Market Average (Global)'}</span>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default CareerOpportunities;
