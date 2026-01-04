import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletter extends Document {
    email: string;
    subscribedAt: Date;
}

const NewsletterSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<INewsletter>('Newsletter', NewsletterSchema);

