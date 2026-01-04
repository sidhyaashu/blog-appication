import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    recipient_id: mongoose.Types.ObjectId;
    sender_id: mongoose.Types.ObjectId;
    type: 'reply' | 'comment' | 'clap' | 'follow';
    post_id?: mongoose.Types.ObjectId;
    comment_id?: mongoose.Types.ObjectId;
    read: boolean;
    created_at: Date;
}

const NotificationSchema: Schema = new Schema({
    recipient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['reply', 'comment', 'clap', 'follow'],
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    read: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
NotificationSchema.index({ recipient_id: 1, created_at: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
