import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';
import './ComprehensiveStats.css';

const ComprehensiveStats = ({ stats }) => {
  const { isDarkMode } = useTheme();

  const getMarketDemandColor = (demand) => {
    if (demand === 'Very High') return '#51cf66';
    if (demand === 'High') return '#ffd43b';
    return '#ff8787';
  };

  const getJobGrowthTrend = (growth) => {
    if (growth > 20) return '📈 Rapid Growth';
    if (growth > 15) return '📈 Strong Growth';
    return '📈 Moderate Growth';
  };

  return (
    <Row className="mb-5">
      <Col>
        <div className="stats-section-header">
          <h2 className="stats-title">📊 Employment Market Overview</h2>
          <p className="stats-subtitle">Comprehensive statistics for {stats.name} professionals</p>
        </div>

        {/* Main Stats Grid */}
        <Row className="mb-4">
          {/* Job Openings Card */}
          <Col xs={12} sm={6} lg={3} className="mb-4">
            <div className={`stat-card ${isDarkMode ? 'dark' : 'light'}`}>
              <div className="stat-icon">💼</div>
              <div className="stat-label">Active Job Openings</div>
              <div className="stat-value">{stats.jobOpenings.toLocaleString()}</div>
              <div className="stat-description">Open positions globally</div>
            </div>
          </Col>

          {/* Avg Hiring Rate Card */}
          <Col xs={12} sm={6} lg={3} className="mb-4">
            <div className={`stat-card ${isDarkMode ? 'dark' : 'light'}`}>
              <div className="stat-icon">📈</div>
              <div className="stat-label">Avg. Hiring Rate</div>
              <div className={`stat-value hiring-rate`} style={{ color: getMarketDemandColor('Very High') }}>
                {stats.avgHiringRate}%
              </div>
              <div className="stat-description">Employment rate</div>
            </div>
          </Col>

          {/* Job Growth Card */}
          <Col xs={12} sm={6} lg={3} className="mb-4">
            <div className={`stat-card ${isDarkMode ? 'dark' : 'light'}`}>
              <div className="stat-icon">🚀</div>
              <div className="stat-label">Annual Growth</div>
              <div className="stat-value">{stats.jobGrowth}%</div>
              <div className="stat-description">{getJobGrowthTrend(stats.jobGrowth)}</div>
            </div>
          </Col>

          {/* Market Demand Card */}
          <Col xs={12} sm={6} lg={3} className="mb-4">
            <div className={`stat-card ${isDarkMode ? 'dark' : 'light'}`}>
              <div className="stat-icon">🎯</div>
              <div className="stat-label">Market Demand</div>
              <div className="stat-value" style={{ color: getMarketDemandColor(stats.marketDemand) }}>
                {stats.marketDemand}
              </div>
              <div className="stat-description">Industry demand level</div>
            </div>
          </Col>
        </Row>

        {/* Salary Ranges Section */}
        <div className={`salary-ranges-section ${isDarkMode ? 'dark' : 'light'}`}>
          <h3 className="salary-section-title">💰 Market Salary Ranges</h3>
          <Row>
            {/* Egypt */}
            <Col xs={12} md={4} className="mb-3 mb-md-0">
              <div className={`salary-region ${isDarkMode ? 'dark' : 'light'}`}>
                <div className="region-header">
                  <span className="region-flag">🇪🇬</span>
                  <span className="region-name">Egypt</span>
                </div>
                <div className="salary-info">
                  <div className="salary-row">
                    <span className="salary-label">Entry Level</span>
                    <span className="salary-value">{stats.salaryRanges.egypt.min.toLocaleString()} - {Math.round(stats.salaryRanges.egypt.min * 1.3).toLocaleString()}</span>
                  </div>
                  <div className="salary-row">
                    <span className="salary-label">Average</span>
                    <span className="salary-value salary-highlight">{stats.salaryRanges.egypt.average.toLocaleString()} {stats.salaryRanges.egypt.currency}</span>
                  </div>
                  <div className="salary-row">
                    <span className="salary-label">Senior Level</span>
                    <span className="salary-value">{Math.round(stats.salaryRanges.egypt.average * 1.5).toLocaleString()} - {stats.salaryRanges.egypt.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Col>

            {/* GCC */}
            <Col xs={12} md={4} className="mb-3 mb-md-0">
              <div className={`salary-region gcc ${isDarkMode ? 'dark' : 'light'}`}>
                <div className="region-header">
                  <span className="region-flag">🏢</span>
                  <span className="region-name">GCC Countries</span>
                </div>
                <div className="salary-info">
                  <div className="salary-row">
                    <span className="salary-label">Entry Level</span>
                    <span className="salary-value">{stats.salaryRanges.gcc.min.toLocaleString()} - {Math.round(stats.salaryRanges.gcc.min * 1.3).toLocaleString()}</span>
                  </div>
                  <div className="salary-row">
                    <span className="salary-label">Average</span>
                    <span className="salary-value salary-highlight">{stats.salaryRanges.gcc.average.toLocaleString()} {stats.salaryRanges.gcc.currency}</span>
                  </div>
                  <div className="salary-row">
                    <span className="salary-label">Senior Level</span>
                    <span className="salary-value">{Math.round(stats.salaryRanges.gcc.average * 1.5).toLocaleString()} - {stats.salaryRanges.gcc.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Col>

            {/* Global */}
            <Col xs={12} md={4}>
              <div className={`salary-region global ${isDarkMode ? 'dark' : 'light'}`}>
                <div className="region-header">
                  <span className="region-flag">🌍</span>
                  <span className="region-name">Global Market</span>
                </div>
                <div className="salary-info">
                  <div className="salary-row">
                    <span className="salary-label">Entry Level</span>
                    <span className="salary-value">{stats.salaryRanges.global.min.toLocaleString()} - {Math.round(stats.salaryRanges.global.min * 1.3).toLocaleString()}</span>
                  </div>
                  <div className="salary-row">
                    <span className="salary-label">Average</span>
                    <span className="salary-value salary-highlight">{stats.salaryRanges.global.average.toLocaleString()} {stats.salaryRanges.global.currency}</span>
                  </div>
                  <div className="salary-row">
                    <span className="salary-label">Senior Level</span>
                    <span className="salary-value">{Math.round(stats.salaryRanges.global.average * 1.5).toLocaleString()} - {stats.salaryRanges.global.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Key Insights */}
        <div className={`insights-section ${isDarkMode ? 'dark' : 'light'}`}>
          <h3 className="insights-title">💡 Key Market Insights</h3>
          <Row>
            <Col xs={12} sm={6} md={4} className="mb-3 mb-md-0">
              <div className="insight-card">
                <span className="insight-icon">📍</span>
                <span className="insight-text">Highest salaries in GCC region</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4} className="mb-3 mb-md-0">
              <div className="insight-card">
                <span className="insight-icon">🔥</span>
                <span className="insight-text">{stats.jobGrowth}% annual job growth</span>
              </div>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <div className="insight-card">
                <span className="insight-icon">✅</span>
                <span className="insight-text">{stats.avgHiringRate}% hiring rate indicates strong demand</span>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default ComprehensiveStats;
