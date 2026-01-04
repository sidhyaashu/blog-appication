import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'admin' | 'user';
    googleId?: string;
    avatar?: string;
    bio?: string;
    created_at: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google Auth users
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    googleId: { type: String },
    avatar: { type: String, default: '' },
    bio: { type: String, maxlength: 500, default: '' },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
