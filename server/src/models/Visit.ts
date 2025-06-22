import { Document, model, Schema, Types } from 'mongoose';

// Interface for the Visit document
export interface IVisit extends Document {
	visitor: Types.ObjectId;      // User who performed the visit
	visitedUser: Types.ObjectId;  // User whose profile was visited
	visitedAt: Date;              // Timestamp of the visit
}

// Visit Schema definition
const visitSchema = new Schema<IVisit>({
	visitor: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Visitor ID is required'],
		index: true,
	},
	visitedUser: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Visited user ID is required'],
		index: true,
	},
	visitedAt: {
		type: Date,
		default: Date.now,
		index: -1,  // Descending index for recent visits
	},
});

// Remove the unique constraint but keep the index for query performance
visitSchema.index({ visitor: 1, visitedUser: 1 });

// Create the model
const Visit = model<IVisit>('Visit', visitSchema);

export default Visit;