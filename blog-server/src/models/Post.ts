import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url: string;
    status: 'draft' | 'published';
    image: string;
    category_id: mongoose.Types.ObjectId;
    author_id: mongoose.Types.ObjectId;
    featured: boolean;
    read_time: number;
    published_at: Date;
    created_at: Date;
    updated_at: Date;
}

const PostSchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image_url: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    image: { type: String },
    category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    author_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    featured: { type: Boolean, default: false },
    read_time: { type: Number, required: true },
    published_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IPost>('Post', PostSchema);
