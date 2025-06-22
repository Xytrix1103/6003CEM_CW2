//send tmdb request
import axios from 'axios';
import config from '../config/config';

const tmdbClient = axios.create({
	baseURL: 'https://api.themoviedb.org/3',
	params: {
		api_key: config.TMDB_API_KEY,
	},
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${config.TMDB_READ_ACCESS_TOKEN}`,
	},
});

// OMDb Client
const omdbClient = axios.create({
	baseURL: 'https://www.omdbapi.com',
	params: {
		apikey: config.OMDB_API_KEY,
	},
});

// JustWatch Client (example)
const justWatchClient = axios.create({
	baseURL: 'https://apis.justwatch.com',
});

export {
	tmdbClient,
	omdbClient,
	justWatchClient,
};