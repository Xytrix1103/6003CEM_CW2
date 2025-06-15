// src/models/User.ts
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  displayName?: string;
  // Add more fields as needed
}

const UserSchema = new Schema<IUser>({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String },
  // Add more fields as needed
});

export default model<IUser>('User', UserSchema);