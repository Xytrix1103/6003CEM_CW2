import type { Types } from 'mongoose';
import { Document, model, Schema } from 'mongoose';

export interface IWatched extends Document {
	_id: Types.ObjectId; // Explicitly define _id
	user: Types.ObjectId;   // Reference to User model
	movieId: number;        // TMDB movie ID
	isFavorited: boolean;   // Whether the movie is favorited
	feedback: {
		rating: number | null;
		content: string | null;
		createdAt: Date;
		updatedAt: Date;
	};
	createdAt: Date;        // Timestamp when the movie was watched
}

const WatchedSchema = new Schema<IWatched>({
	user: {
		type: Schema.Types.ObjectId,  // Use Schema.Types.ObjectId
		ref: 'User',
		required: true,
	},
	movieId: {
		type: Number,
		required: true,
	},
	isFavorited: {
		type: Boolean,
		default: false,
	},
	feedback: {
		rating: {
			type: Number,
			default: null,
			min: 0,
			max: 5,
		},
		content: {
			type: String,
			default: null,
			maxlength: 1000,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
}, {
	timestamps: true,  // Automatically manage createdAt and updatedAt fields
	collection: 'watched',  // Specify the collection name
	versionKey: false,      // Disable __v field
});

// Compound index for faster queries
WatchedSchema.index({ user: 1, movieId: 1 }, { unique: true });

export default model<IWatched>('Watched', WatchedSchema);