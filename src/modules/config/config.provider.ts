import * as dotenv from 'dotenv';
import { Provider } from '@nestjs/common';
import config from 'config';

dotenv.config();

export const CONFIG_SERVICE_PROVIDER_TOKEN = 'ConfigProviderToken';
export const isLocal = () => {
  const host = config.get('SERVER_HOST');
  return host === 'localhost' || host === '127.0.0.1';
};

export const getHost = () => {
  const hostname = config.get('SERVER_HOSTNAME');
  if (hostname) {
    return `${hostname}`;
  }
  return `${config.get('SERVER_HOST')}:${config.get('SERVER_PORT')}`;
};

export const getPort = (): string => {
  return `${config.get('SERVER_HOST')}`;
};

export const getUriMongodb = () => {
  return `${config.get('MONGODB_URI')}`;
};

export const getConfig = () => {
  return config;
};

export const getPrefixRoute = () => {
  return `${config.get('SERVICE_NAME_DOCSBASEURL')}`;
};

export const configProvider: Provider = {
  provide: CONFIG_SERVICE_PROVIDER_TOKEN,
  useFactory: () => {
    dotenv.config();
    return import('config');
  },
};