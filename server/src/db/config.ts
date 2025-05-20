// src/db/config.ts
import mongoose, {ConnectOptions, mongo} from 'mongoose'
import config from '../config/config'

const {
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_CLUSTER,
    MONGODB_DB,
} = config

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}/${MONGODB_DB}?retryWrites=true&w=majority`

const options: ConnectOptions = {
    serverApi: {
        version: mongo.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
}

mongoose.connection
    .on('connected', () => console.log('MongoDB connected'))
    .on('disconnected', () => console.log('MongoDB disconnected'))
    .on('error', (err) => console.error('MongoDB error:', err))

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(uri, options)
        await mongoose.connection.db!.admin().ping()
        console.log('MongoDB ping successful')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}