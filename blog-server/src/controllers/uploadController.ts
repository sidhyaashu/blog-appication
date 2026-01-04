import type { Request, Response } from 'express';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Create a stream from the buffer
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'ovanthra-blog',
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Image upload failed' });
                }
                res.status(200).json({
                    url: result?.secure_url,
                    public_id: result?.public_id,
                });
            }
        );

        // Pipe the buffer to the stream
        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(stream);

    } catch (error) {
        console.error('Upload controller error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
