import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark extends Document {
    user_id: mongoose.Types.ObjectId;
    post_id: mongoose.Types.ObjectId;
    created_at: Date;
}

const BookmarkSchema: Schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    created_at: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate bookmarks
BookmarkSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

export default mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
