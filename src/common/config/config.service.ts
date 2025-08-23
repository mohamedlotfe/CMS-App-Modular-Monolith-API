import * as process from 'process';

const configs = () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  GLOBAL: {
    PORT: process.env.PORT || 3000,
  },
  DATABASE: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT || '5432'),
    USER: process.env.DB_USER || 'postgres',
    PASS: process.env.DB_PASS || 'postgres',
    NAME: process.env.DB_NAME || 'content_db',
  },
  REDIS: {
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: parseInt(process.env.REDIS_PORT || '6379'),
  },
  ELASTICSEARCH: {
    NODE: process.env.ES_NODE || 'http://localhost:9200',
    INDEX: process.env.ES_INDEX || 'contents',
    USERNAME: process.env.ES_USERNAME || '',
    PASSWORD: process.env.ES_PASSWORD || '',
  },
});

export default configs;
