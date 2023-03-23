import 'ts-node/register';
import path from 'path';
import { config as c } from 'dotenv'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Environment vars logic
let envFilename;
if (process.env.NODE_ENV) {
    envFilename = '.env.' + process.env.NODE_ENV
} else {
    envFilename = '.env'
}

c({ path: path.resolve(__dirname, `../${envFilename}`) })


export const commonConfig = {
    client: 'pg',
    migrations: {
        directory: path.join(__dirname, 'migrations'),
    },
    seeds: {
        directory: path.join(__dirname, 'seeds'),
    },
    connection: {
        user: process.env.DB_ADMIN_USERNAME || 'postgres',
        password: process.env.DB_ADMIN_PASSWORD || 'postgres',
    },
};

const config = {
    ...commonConfig,
    connection: {
        database: process.env.POSTGRES_DB,
    },
};

export default config
