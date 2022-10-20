import { config as readEnv } from 'dotenv';
import { join } from 'path';

export type Config = {
  db: {
    vendor: any;
    host: string;
    logging: boolean;
  };
};

export function makeConfig(envFile: string): Config {
  const output = readEnv({ path: envFile });

  return {
    db: {
      vendor: output.parsed.DB_VENDOR as any,
      host: output.parsed.DB_HOST,
      logging: output.parsed.DB_LOGGING === 'true',
    },
  };
}

const envTestingFile = join(__dirname, '../../../../.env.testing');
export const testConfig = makeConfig(envTestingFile);
