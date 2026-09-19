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

  /**
   * Standard intuitive color gradient scale for hiring rates:
   * - High rates (>= 80%): Vibrant Green
   * - Good rates (75% - 79%): Lime / Light Green
   * - Moderate rates (70% - 74%): Amber / Warm Orange-Yellow
   * - Weak / Low rates (< 70%): Clean Red
   */
  const getHiringRateInfo = (rate) => {
    if (rate >= 80) {
      return {
        label: language === 'ar' ? 'طلب عالي' : 'High Demand',
        color: '#10b981',
        gradient: 'linear-gradient(90deg, #34d399 0%, #10b981 100%)',
        bgLight: 'rgba(16, 185, 129, 0.1)',
        bgDark: 'rgba(16, 185, 129, 0.18)',
        borderLight: 'rgba(16, 185, 129, 0.3)',
        borderDark: 'rgba(16, 185, 129, 0.4)',
        textLight: '#059669',
        textDark: '#34d399'
      };
    }
    if (rate >= 75) {
      return {
        label: language === 'ar' ? 'طلب جيد' : 'Good Demand',
        color: '#84cc16',
        gradient: 'linear-gradient(90deg, #a3e635 0%, #84cc16 100%)',
        bgLight: 'rgba(132, 204, 22, 0.1)',
        bgDark: 'rgba(132, 204, 22, 0.18)',
        borderLight: 'rgba(132, 204, 22, 0.3)',
        borderDark: 'rgba(132, 204, 22, 0.4)',
        textLight: '#65a30d',
        textDark: '#a3e635'
      };
    }
    if (rate >= 70) {
      return {
        label: language === 'ar' ? 'طلب معتدل' : 'Moderate Demand',
        color: '#f59e0b',
        gradient: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
        bgLight: 'rgba(245, 158, 11, 0.1)',
        bgDark: 'rgba(245, 158, 11, 0.18)',
        borderLight: 'rgba(245, 158, 11, 0.3)',
        borderDark: 'rgba(245, 158, 11, 0.4)',
        textLight: '#d97706',
        textDark: '#fbbf24'
      };
    }
    return {
      label: language === 'ar' ? 'طلب منخفض' : 'Low Demand',
      color: '#ef4444',
      gradient: 'linear-gradient(90deg, #f87171 0%, #ef4444 100%)',
      bgLight: 'rgba(239, 68, 68, 0.1)',
      bgDark: 'rgba(239, 68, 68, 0.18)',
      borderLight: 'rgba(239, 68, 68, 0.3)',
      borderDark: 'rgba(239, 68, 68, 0.4)',
      textLight: '#dc2626',
      textDark: '#f87171'
    };
  };

  return (
    <Row className="mb-5">
      <Col>
        <div className="section-header">
          <h2 className="section-title">💼 {t('careerOpportunities.title', language)}</h2>
          <p className="section-subtitle">
            {language === 'ar'
              ? 'استكشف نطاقات الرواتب عبر مناطق مختلفة ومتوسطات السوق والطلب على التوظيف'
              : 'Explore salary ranges across different regions, market averages, and hiring demand'}
          </p>
        </div>

        <div className={`careers-container ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="careers-grid">
            {opportunities.map((career, index) => {
              const rateInfo = getHiringRateInfo(career.hiringRate);
              return (
                <div
                  key={index}
                  className={`career-card ${isDarkMode ? 'dark' : 'light'} ${hoveredIndex === index ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Card Header */}
                  <div className="career-header">
                    <h3 className="career-title">{career.title}</h3>
                    <div
                      className="hiring-rate-badge"
                      style={{
                        backgroundColor: isDarkMode ? rateInfo.bgDark : rateInfo.bgLight,
                        borderColor: isDarkMode ? rateInfo.borderDark : rateInfo.borderLight
                      }}
                    >
                      <span
                        className="hiring-rate-label"
                        style={{ color: isDarkMode ? rateInfo.textDark : rateInfo.textLight }}
                      >
                        {rateInfo.label}
                      </span>
                      <span
                        className="hiring-rate-value"
                        style={{ color: isDarkMode ? rateInfo.textDark : rateInfo.textLight }}
                      >
                        {career.hiringRate}%
                      </span>
                    </div>
                  </div>

                  {/* Career Description */}
                  <p className="career-description">{career.description}</p>

                  {/* Market Average Highlight */}
                  {career.marketAverage && (
                    <div className="market-average-section">
                      <span className="market-average-label">
                        💡 {language === 'ar' ? 'متوسط السوق العالمي' : 'Global Market Average'}
                      </span>
                      <span className="market-average-value">
                        USD {career.marketAverage.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Regional Salaries Breakdown */}
                  <div className="salaries-grid">
                    {/* Egypt */}
                    <div className="salary-column egypt">
                      <div className="region-flag">🇪🇬</div>
                      <div className="region-name">{language === 'ar' ? 'مصر' : 'Egypt'}</div>
                      <div className="salary-range">{formatSalary(career.salaries.egypt)}</div>
                      {career.salaries.egypt.average && (
                        <div className="salary-average">
                          {language === 'ar' ? 'المتوسط:' : 'Avg:'} {formatAverage(career.salaries.egypt.average, 'EGP')}
                        </div>
                      )}
                    </div>

                    {/* GCC */}
                    <div className="salary-column gcc">
                      <div className="region-flag">🏢</div>
                      <div className="region-name">GCC</div>
                      <div className="salary-range">{formatSalary(career.salaries.gcc)}</div>
                      {career.salaries.gcc.average && (
                        <div className="salary-average">
                          {language === 'ar' ? 'المتوسط:' : 'Avg:'} {formatAverage(career.salaries.gcc.average, 'AED')}
                        </div>
                      )}
                    </div>

                    {/* Global */}
                    <div className="salary-column global">
                      <div className="region-flag">🌍</div>
                      <div className="region-name">{language === 'ar' ? 'عالمي' : 'Global'}</div>
                      <div className="salary-range">{formatSalary(career.salaries.global)}</div>
                      {career.salaries.global.average && (
                        <div className="salary-average">
                          {language === 'ar' ? 'المتوسط:' : 'Avg:'} {formatAverage(career.salaries.global.average, 'USD')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hiring Rate Visual Indicator */}
                  <div className="hiring-indicator">
                    <div className="hiring-bar-container">
                      <div 
                        className="hiring-bar-fill" 
                        style={{ 
                          width: `${career.hiringRate}%`,
                          background: rateInfo.gradient || rateInfo.color
                        }}
                      ></div>
                    </div>
                    <span 
                      className="hiring-percentage"
                      style={{ color: isDarkMode ? rateInfo.textDark : rateInfo.textLight }}
                    >
                      {career.hiringRate}% {language === 'ar' ? 'معدل التوظيف' : 'hiring rate'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default CareerOpportunities;
