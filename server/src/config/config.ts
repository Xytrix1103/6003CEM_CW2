import dotenv from 'dotenv';

dotenv.config();

interface Config {
	PORT: number;
	NODE_ENV: string;
	MONGODB_USER: string;
	MONGODB_PASSWORD: string;
	MONGODB_CLUSTER: string;
	MONGODB_APP_NAME: string;
	MONGODB_DB: string;
	OMDB_API_KEY: string;
	TMDB_API_KEY: string;
	TMDB_READ_ACCESS_TOKEN: string;
}

const config: Config = {
	PORT: Number(process.env.PORT) || 4000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	MONGODB_USER: process.env.MONGODB_USER || 'admin',
	MONGODB_PASSWORD: process.env.MONGODB_PASSWORD || 'admin',
	MONGODB_CLUSTER: process.env.MONGODB_CLUSTER || 'cluster0',
	MONGODB_APP_NAME: process.env.MONGODB_APP_NAME || 'mydatabase',
	MONGODB_DB: process.env.MONGODB_DB || 'mydatabase',
	OMDB_API_KEY: process.env.OMDB_API_KEY || 'your_omdb_api_key',
	TMDB_API_KEY: process.env.TMDB_API_KEY || 'your_tmdb_api_key',
	TMDB_READ_ACCESS_TOKEN: process.env.TMDB_READ_ACCESS_TOKEN || 'your_tmdb_read_access_token',
};

export default config;