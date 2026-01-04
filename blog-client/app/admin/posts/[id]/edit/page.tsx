'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import TiptapEditor from '@/components/editor/tiptap-editor';
import { API_URL } from '@/lib/api';

interface Category {
    _id: string;
    name: string;
}

export default function EditPostPage({ params }: { params: { id: string } }) {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [featured, setFeatured] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const router = useRouter();
    const postId = params.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Categories
                const catRes = await fetch(`${API_URL}/categories`);
                if (catRes.ok) {
                    const categoriesData = await catRes.json();
                    setCategories(categoriesData);
                }

                // Fetch Post Data by ID (We might need a getById endpoint or filter client side if not available, usually slug is used public facing but ID for admin)
                // The backend likely has a getById or we can use the public slug endpoint if we only had slug. 
                // But admin route uses [id], so let's try fetching by ID.
                // Wait, the backend strictly has /posts/:slug for public.
                // Does it have /posts/:id for admin?
                // Looking at posts.ts from verified files:
                // router.put('/:id', ...) exists. router.delete('/:id', ...) exists.
                // BUT router.get('/:slug', ...) is the only single fetcher shown in my previous view_file of posts.ts?
                // Let me double check... 
                // Ah, I need to check if there is a GET /:id.
                // If not, I might need to add it or find the post from the list if I have it in state (but page reload breaks that).
                // Let's assume for now I might need to fix backend to support GET /:id or rely on slug if I can get it.
                // Actually, let's look at how I will fetch it.
                // I'll try fetching from the public slug endpoint first if I can't find ID, but wait, the URL param is ID.
                // I should probably add a GET /:id endpoint for admin if it doesn't exist.

                // Let's try to fetch all and find, or just assume I need to fix backend first? 
                // Proceeding with assumption I will fix backend to ensure GET /:id works or use a specific admin endpoint.
                // Let's implement the frontend assuming the endpoint exists/will exist.

                // actually, I can use the existing public API if I knew the slug, but I only have ID from URL. 
                // I will add GET /:id to backend to be safe.

                const token = localStorage.getItem('token');
                const postRes = await fetch(`${API_URL}/posts`, { // Fetching all and filtering is inefficient but works as fallback
                    headers: { 'Authorization': `Bearer ${token}` } // Admin route might need auth
                });

                // BETTER: Just implement GET /posts/:id in backend.
                // I will write this frontend code to call `${API_URL}/posts/${postId}` (GET).
                const res = await fetch(`${API_URL}/posts/${postId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const post = await res.json();
                    setTitle(post.title);
                    setSlug(post.slug);
                    setExcerpt(post.excerpt || '');
                    setContent(post.content);
                    setImageUrl(post.image_url || post.image || ''); // Handle inconsistent naming if any
                    setFeatured(post.featured);
                    setSelectedCategory(post.category_id?._id || post.category_id || '');
                } else {
                    toast.error('Failed to fetch post details');
                }

            } catch (error) {
                console.error('Failed to load data', error);
                toast.error('Failed to load data');
            } finally {
                setFetching(false);
            }
        };

        fetchData();
    }, [postId]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    slug,
                    excerpt,
                    content,
                    image: imageUrl, // Backend expects 'image' or 'image_url'? Controller said 'image = image || post.image'
                    category_id: selectedCategory,
                    featured,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update post');
            }

            toast.success('Post updated successfully!');
            router.push('/admin/posts');

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-muted-foreground">Loading post details...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Post</h1>

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
                    <Label htmlFor="image">Hero Image URL</Label>
                    <Input id="image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
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

                <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
