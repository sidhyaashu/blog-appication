'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import TiptapEditor from '@/components/editor/tiptap-editor';
import { ImageUpload } from '@/components/ui/image-upload';
import { API_URL } from '@/lib/api';

interface Category {
    _id: string;
    name: string;
}

export default function NewPostPage() {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('<p>Start writing...</p>');
    const [imageUrl, setImageUrl] = useState('');
    const [featured, setFeatured] = useState(false);
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_URL}/categories`);
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                    if (data.length > 0) setSelectedCategory(data[0]._id);
                }
            } catch (error) {
                console.error('Failed to fetch categories', error);
                toast.error('Failed to load categories');
            }
        };
        fetchCategories();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Retrieve token
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Not authenticated');
            router.push('/auth/login');
            return;
        }

        if (!imageUrl) {
            toast.error('Please upload a cover image');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    slug,
                    excerpt,
                    content,
                    image_url: imageUrl,
                    category_id: selectedCategory, // This needs to be valid ObjectId
                    featured,
                    read_time: 5, // Calculate this based on word count
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create post');
            }

            toast.success('Post created successfully!');
            router.push('/admin');

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <textarea
                        id="excerpt"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <ImageUpload
                        value={imageUrl}
                        onChange={(url) => setImageUrl(url)}
                        onRemove={() => setImageUrl('')}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                        id="category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        required
                    >
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>Content</Label>
                    <TiptapEditor content={content} onChange={setContent} />
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox id="featured" checked={featured} onCheckedChange={(c) => setFeatured(c as boolean)} />
                    <Label htmlFor="featured">Featured (Top Carousel)</Label>
                </div>

                <Button type="submit" disabled={loading} size="lg">
                    {loading ? 'Publishing...' : 'Publish Post'}
                </Button>
            </form>
        </div>
    );
}
