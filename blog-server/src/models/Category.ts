import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    slug: string;
    created_at: Date;
}

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model<ICategory>('Category', CategorySchema);
