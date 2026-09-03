export const fieldData = {
  ai: {
    id: 'ai',
    name: 'Artificial Intelligence',
    description: 'Artificial Intelligence (AI) is a transformative field that focuses on creating intelligent machines capable of performing tasks that typically require human intelligence. From machine learning algorithms to neural networks, AI encompasses a wide range of technologies that enable systems to learn, reason, and make decisions. As an AI professional, you\'ll work on cutting-edge projects that push the boundaries of what\'s possible in technology.',
    employmentStats: {
      jobOpenings: 15400,
      avgHiringRate: 71.6,
      jobGrowth: 18.5,
      marketDemand: 'Very High',
      salaryRanges: {
        egypt: {
          min: 25000,
          max: 80000,
          average: 52500,
          currency: 'EGP'
        },
        gcc: {
          min: 120000,
          max: 350000,
          average: 235000,
          currency: 'AED'
        },
        global: {
          min: 95000,
          max: 200000,
          average: 147500,
          currency: 'USD'
        }
      }
    },
    careerOpportunities: [
      { 
        title: 'Machine Learning Engineer', 
        description: 'Design and implement machine learning models and systems',
        hiringRate: 78,
        marketAverage: 147500,
        salaries: {
          egypt: { min: 30000, max: 60000, currency: 'EGP', average: 45000 },
          gcc: { min: 150000, max: 300000, currency: 'AED', average: 225000 },
          global: { min: 110000, max: 170000, currency: 'USD', average: 140000 }
        }
      },
      { 
        title: 'AI Research Scientist', 
        description: 'Conduct research to advance AI algorithms and techniques',
        hiringRate: 65,
        marketAverage: 160000,
        salaries: {
          egypt: { min: 40000, max: 80000, currency: 'EGP', average: 60000 },
          gcc: { min: 180000, max: 350000, currency: 'AED', average: 265000 },
          global: { min: 120000, max: 200000, currency: 'USD', average: 160000 }
        }
      },
      { 
        title: 'Data Scientist', 
        description: 'Analyze complex data to help organizations make data-driven decisions',
        hiringRate: 82,
        marketAverage: 127500,
        salaries: {
          egypt: { min: 25000, max: 55000, currency: 'EGP', average: 40000 },
          gcc: { min: 120000, max: 250000, currency: 'AED', average: 185000 },
          global: { min: 95000, max: 160000, currency: 'USD', average: 127500 }
        }
      },
      { 
        title: 'AI Product Manager', 
        description: 'Lead the development and strategy of AI-powered products',
        hiringRate: 72,
        marketAverage: 155000,
        salaries: {
          egypt: { min: 35000, max: 70000, currency: 'EGP', average: 52500 },
          gcc: { min: 200000, max: 350000, currency: 'AED', average: 275000 },
          global: { min: 130000, max: 180000, currency: 'USD', average: 155000 }
        }
      },
      { 
        title: 'Computer Vision Engineer', 
        description: 'Develop systems that can interpret and understand visual data',
        hiringRate: 71,
        marketAverage: 135000,
        salaries: {
          egypt: { min: 32000, max: 62000, currency: 'EGP', average: 47000 },
          gcc: { min: 160000, max: 310000, currency: 'AED', average: 235000 },
          global: { min: 105000, max: 165000, currency: 'USD', average: 135000 }
        }
      }
    ],
    skills: [
      { name: 'Python', level: 'Advanced' },
      { name: 'Machine Learning', level: 'Advanced' },
      { name: 'Deep Learning', level: 'Intermediate' },
      { name: 'TensorFlow/PyTorch', level: 'Intermediate' },
      { name: 'Data Analysis', level: 'Advanced' },
      { name: 'Statistics', level: 'Intermediate' },
      { name: 'Cloud Computing', level: 'Intermediate' },
      { name: 'Natural Language Processing', level: 'Intermediate' }
    ],
    roadmap: [
      {
        phase: 'Foundation',
        duration: '2-3 months',
        topics: ['Python Programming', 'Data Structures & Algorithms', 'Mathematics (Linear Algebra, Calculus)', 'Statistics & Probability'],
        videos: [
          { title: 'Python for Beginners', url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8' },
          { title: 'Data Structures Complete Course', url: 'https://www.youtube.com/watch?v=8hly31xKli0' }
        ]
      },
      {
        phase: 'Machine Learning Basics',
        duration: '3-4 months',
        topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Feature Engineering'],
        videos: [
          { title: 'Machine Learning Course', url: 'https://www.youtube.com/watch?v=uzVoq9z7pYw' },
          { title: 'Scikit-learn Tutorial', url: 'https://www.youtube.com/watch?v=0Lt9wBxqXA8' }
        ]
      },
      {
        phase: 'Deep Learning',
        duration: '4-6 months',
        topics: ['Neural Networks', 'CNNs', 'RNNs', 'Transfer Learning'],
        videos: [
          { title: 'Deep Learning Specialization', url: 'https://www.youtube.com/watch?v=aircAruvnKk' },
          { title: 'TensorFlow 2.0 Course', url: 'https://www.youtube.com/watch?v=2Fmc1Wy7pQw' }
        ]
      },
      {
        phase: 'Specialization',
        duration: '6-12 months',
        topics: ['NLP', 'Computer Vision', 'Reinforcement Learning', 'AI Ethics'],
        videos: [
          { title: 'NLP with Deep Learning', url: 'https://www.youtube.com/watch?v=2Fmc1Wy7pQw' },
          { title: 'Computer Vision Basics', url: 'https://www.youtube.com/watch?v=6M2N6B4t0cY' }
        ]
      }
    ],
    courses: [
      { name: 'Machine Learning by Andrew Ng', platform: 'Coursera', topics: ['Supervised Learning', 'Unsupervised Learning', 'Best Practices'] },
      { name: 'Deep Learning Specialization', platform: 'Coursera', topics: ['Neural Networks', 'CNNs', 'Sequence Models'] },
      { name: 'CS229: Machine Learning', platform: 'Stanford', topics: ['ML Foundations', 'Mathematical Theory', 'Applications'] },
      { name: 'Fast.ai Practical Deep Learning', platform: 'Fast.ai', topics: ['Practical DL', 'Image Classification', 'NLP'] }
    ]
  },
  dataScience: {
    id: 'dataScience',
    name: 'Data Science',
    description: 'Data Science is an interdisciplinary field that combines statistics, mathematics, computer science, and domain expertise to extract meaningful insights from data. Data scientists work with large datasets to uncover patterns, trends, and correlations that can drive business decisions and scientific discoveries. This field is perfect for those who love working with data and want to make a significant impact through data-driven insights.',
    employmentStats: {
      jobOpenings: 18200,
      avgHiringRate: 76.8,
      jobGrowth: 22.3,
      marketDemand: 'Very High',
      salaryRanges: {
        egypt: {
          min: 18000,
          max: 75000,
          average: 46500,
          currency: 'EGP'
        },
        gcc: {
          min: 80000,
          max: 350000,
          average: 215000,
          currency: 'AED'
        },
        global: {
          min: 65000,
          max: 160000,
          average: 112500,
          currency: 'USD'
        }
      }
    },
    careerOpportunities: [
      { 
        title: 'Data Scientist', 
        description: 'Extract insights from data using statistical methods and machine learning',
        hiringRate: 80,
        marketAverage: 112500,
        salaries: {
          egypt: { min: 24000, max: 54000, currency: 'EGP', average: 39000 },
          gcc: { min: 120000, max: 250000, currency: 'AED', average: 185000 },
          global: { min: 95000, max: 160000, currency: 'USD', average: 127500 }
        }
      },
      { 
        title: 'Data Analyst', 
        description: 'Analyze data to help organizations make informed decisions',
        hiringRate: 85,
        marketAverage: 87500,
        salaries: {
          egypt: { min: 18000, max: 40000, currency: 'EGP', average: 29000 },
          gcc: { min: 80000, max: 180000, currency: 'AED', average: 130000 },
          global: { min: 65000, max: 110000, currency: 'USD', average: 87500 }
        }
      },
      { 
        title: 'Business Intelligence Analyst', 
        description: 'Create dashboards and reports to track business performance',
        hiringRate: 77,
        marketAverage: 97500,
        salaries: {
          egypt: { min: 20000, max: 45000, currency: 'EGP', average: 32500 },
          gcc: { min: 100000, max: 200000, currency: 'AED', average: 150000 },
          global: { min: 75000, max: 120000, currency: 'USD', average: 97500 }
        }
      },
      { 
        title: 'Data Engineer', 
        description: 'Build and maintain data pipelines and infrastructure',
        hiringRate: 76,
        marketAverage: 120000,
        salaries: {
          egypt: { min: 28000, max: 58000, currency: 'EGP', average: 43000 },
          gcc: { min: 140000, max: 280000, currency: 'AED', average: 210000 },
          global: { min: 90000, max: 150000, currency: 'USD', average: 120000 }
        }
      },
      { 
        title: 'Analytics Manager', 
        description: 'Lead data analytics teams and strategies',
        hiringRate: 68,
        marketAverage: 135000,
        salaries: {
          egypt: { min: 40000, max: 75000, currency: 'EGP', average: 57500 },
          gcc: { min: 200000, max: 350000, currency: 'AED', average: 275000 },
          global: { min: 110000, max: 160000, currency: 'USD', average: 135000 }
        }
      }
    ],
    skills: [
      { name: 'Python/R', level: 'Advanced' },
      { name: 'SQL', level: 'Advanced' },
      { name: 'Data Visualization', level: 'Advanced' },
      { name: 'Statistical Analysis', level: 'Advanced' },
      { name: 'Machine Learning', level: 'Intermediate' },
      { name: 'Data Wrangling', level: 'Advanced' },
      { name: 'Big Data Technologies', level: 'Intermediate' },
      { name: 'Business Acumen', level: 'Intermediate' }
    ],
    roadmap: [
      {
        phase: 'Programming & Statistics',
        duration: '2-3 months',
        topics: ['Python/R Programming', 'SQL Fundamentals', 'Statistics & Probability', 'Excel Basics'],
        videos: [
          { title: 'Python for Data Science', url: 'https://www.youtube.com/watch?v=r-uOLxNrNk4' },
          { title: 'SQL for Data Science', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' }
        ]
      },
      {
        phase: 'Data Analysis',
        duration: '3-4 months',
        topics: ['Data Cleaning', 'Exploratory Data Analysis', 'Data Visualization', 'Statistical Testing'],
        videos: [
          { title: 'Data Analysis with Python', url: 'https://www.youtube.com/watch?v=r-uOLxNrNk4' },
          { title: 'Data Visualization Tutorial', url: 'https://www.youtube.com/watch?v=a9UrKT0e0sk' }
        ]
      },
      {
        phase: 'Machine Learning',
        duration: '4-6 months',
        topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Feature Engineering'],
        videos: [
          { title: 'Machine Learning for Data Science', url: 'https://www.youtube.com/watch?v=uzVoq9z7pYw' },
          { title: 'Scikit-learn for Data Science', url: 'https://www.youtube.com/watch?v=0Lt9wBxqXA8' }
        ]
      },
      {
        phase: 'Advanced Topics',
        duration: '6-12 months',
        topics: ['Big Data', 'Deep Learning', 'Time Series Analysis', 'A/B Testing'],
        videos: [
          { title: 'Big Data Technologies', url: 'https://www.youtube.com/watch?v=Ej_2yO9vCAQ' },
          { title: 'Time Series Analysis', url: 'https://www.youtube.com/watch?v=JbdcN1T6fG0' }
        ]
      }
    ],
    courses: [
      { name: 'Data Science Specialization', platform: 'Coursera', topics: ['R Programming', 'Data Cleaning', 'Exploratory Analysis'] },
      { name: 'Python for Data Science', platform: 'edX', topics: ['Python Basics', 'Data Analysis', 'Visualization'] },
      { name: 'Data Analysis with Python', platform: 'DataCamp', topics: ['Pandas', 'NumPy', 'Data Manipulation'] },
      { name: 'SQL for Data Science', platform: 'Udacity', topics: ['SQL Fundamentals', 'Database Design', 'Query Optimization'] }
    ]
  }
};

// Community comments start empty - users will populate them
export const communityComments = [];