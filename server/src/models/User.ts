import type { Types } from 'mongoose';
import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
	_id: Types.ObjectId; // Explicitly define _id
	firebaseUid: string;
	email: string;
	displayName: string;
	watchlist: number[];        // TMDB movie IDs
	watched: Types.ObjectId[];  // References to Watched documents
	visits: Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
	firebaseUid: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	displayName: {
		type: String,
		required: true,
		trim: true,
	},
	watchlist: {
		type: [Number],
		default: [],
	},
	watched: [{
		type: Schema.Types.ObjectId,  // Use Schema.Types.ObjectId
		ref: 'Watched',
		default: [],
	}],
	visits: [{
		type: Schema.Types.ObjectId,  // Use Schema.Types.ObjectId
		ref: 'Visit',
		default: [],
	}],
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
}, {
	timestamps: true,  // Automatically manage createdAt and updatedAt fields
	collection: 'users', // Specify the collection name
});

export default model<IUser>('User', UserSchema);