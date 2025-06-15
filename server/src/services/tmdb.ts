//send tmdb request
import axios from 'axios';
import config from '../config/config';

const tmdb = axios.create({
	baseURL: 'https://api.themoviedb.org/3',
	params: {
		api_key: config.TMDB_API_KEY,
	},
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${config.TMDB_READ_ACCESS_TOKEN}`,
	},
});

export default tmdb;