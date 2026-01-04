import mongoose, { Schema, Document } from 'mongoose';

export interface IClap extends Document {
    user_id: mongoose.Types.ObjectId;
    post_id: mongoose.Types.ObjectId;
    count: number;
    created_at: Date;
    updated_at: Date;
}

const ClapSchema: Schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    count: { type: Number, default: 1, min: 1, max: 50 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Compound index to ensure one clap record per user per post
ClapSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

export default mongoose.model<IClap>('Clap', ClapSchema);
