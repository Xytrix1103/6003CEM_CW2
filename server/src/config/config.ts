import dotenv from 'dotenv';

dotenv.config();

interface Config {
    PORT: number;
    NODE_ENV: string;
    MONGODB_USER: string;
    MONGODB_PASSWORD: string;
    MONGODB_CLUSTER: string;
    MONGODB_DB: string;
}

const config: Config = {
    PORT: Number(process.env.PORT) || 4000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGODB_USER: process.env.MONGODB_USER || 'admin',
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD || 'admin',
    MONGODB_CLUSTER: process.env.MONGODB_CLUSTER || 'cluster0',
    MONGODB_DB: process.env.MONGODB_DB || 'mydatabase',
};

export default config;