// Feel free to extend this interface
// depending on your app specific config.
export interface EnvConfig {
  API?: string;
  ENV?: string;
}

export const Config: EnvConfig = JSON.parse('<%= ENV_CONFIG %>');

export const SITE_HOST_URL: string = 'http://localhost:5000/';

export const BTCE_REST_URL: string = 'https://btc-e.com/api/3/';

