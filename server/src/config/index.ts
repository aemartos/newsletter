import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface Config {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  clientUrl: string;
  databaseUrl: string;
  email: {
    apiKey: string;
    templateId: string;
    fromEmail: string;
  };
  api: {
    baseUrl: string;
  };
}

const validateRequiredEnvVars = (): void => {
  const requiredVars = ['DATABASE_URL'];
  const missingVars = requiredVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error(
      '❌ Missing required environment variables:',
      missingVars.join(', ')
    );
    console.error(
      'Please check your .env file and ensure all required variables are set.'
    );
    process.exit(1);
  }
};

const createConfig = (): Config => {
  validateRequiredEnvVars();

  const config: Config = {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: (process.env.NODE_ENV as Config['nodeEnv']) || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    databaseUrl: process.env.DATABASE_URL || '',
    email: {
      apiKey: process.env.EMAIL_API_KEY || '',
      templateId: process.env.EMAIL_TEMPLATE_ID || '',
      fromEmail: process.env.EMAIL_FROM || 'noreply@blabla-newsletter.com',
    },
    api: {
      baseUrl: process.env.API_BASE_URL || 'http://localhost:3001/api',
    },
  };

  return config;
};

export const config = createConfig();
