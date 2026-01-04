import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'approved' // Auto-approve for now
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
