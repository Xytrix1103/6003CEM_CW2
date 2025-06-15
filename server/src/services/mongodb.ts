import mongoose from 'mongoose';
import config from '../config/config';

const {
	MONGODB_USER,
	MONGODB_PASSWORD,
	MONGODB_CLUSTER, // Verify single "T" in actual config
	MONGODB_APP_NAME,
	MONGODB_DB,
} = config;

// Encode password for special characters
const encodedPassword = encodeURIComponent(MONGODB_PASSWORD);

// Add authSource=admin and encode credentials
const uri = `mongodb+srv://${MONGODB_USER}:${encodedPassword}@${MONGODB_CLUSTER}/${MONGODB_DB}?retryWrites=true&w=majority&authSource=admin&appName=${MONGODB_APP_NAME}`;

const clientOptions: mongoose.ConnectOptions = {
	serverApi: {
		version: '1',
		strict: true,
		deprecationErrors: true,
	},
};

async function connectDB() {
	try {
		console.log('Connecting to MongoDB...');
		await mongoose.connect(uri, clientOptions);
		console.log('Successfully connected to MongoDB!');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1); // Exit process on connection failure
	}
}

// Persistent connection handlers
mongoose.connection.on('connected', () => {
	console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
	console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
	console.log('Mongoose disconnected');
});

export default connectDB;