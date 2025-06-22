import app from './app';
import config from './config/config';
import connectDB from './services/mongodb';

const PORT = config.PORT;

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}).catch(error => {
	console.error('Failed to connect to DB:', error);
});