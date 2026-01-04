'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { token } = useAuth();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                onChange(data.url);
                toast.success('Image uploaded successfully');
            } else {
                toast.error('Image upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="space-y-4 w-full">
            {value ? (
                <div className="relative aspect-video w-full max-w-xl rounded-lg overflow-hidden border">
                    <div className="absolute top-2 right-2 z-10">
                        <Button
                            type="button"
                            onClick={onRemove}
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <Image
                        src={value}
                        alt="Uploaded image"
                        fill
                        className="object-cover"
                    />
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="
                        relative 
                        cursor-pointer 
                        hover:opacity-70 
                        transition 
                        border-dashed 
                        border-2 
                        p-12 
                        rounded-lg 
                        flex 
                        flex-col 
                        justify-center 
                        items-center 
                        gap-4 
                        text-neutral-600
                        bg-gray-50
                        hover:bg-gray-100
                    "
                >
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className="hidden"
                        disabled={loading}
                    />
                    {loading ? (
                        <>
                            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                            <div className="text-sm">Uploading...</div>
                        </>
                    ) : (
                        <>
                            <Upload className="h-10 w-10 text-gray-400" />
                            <div className="font-semibold text-lg text-gray-500">
                                Click to upload cover image
                            </div>
                            <div className="text-xs text-gray-400">
                                MPG, PNG, JPG up to 5MB
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
