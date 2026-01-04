import { Post, Category, AuthResponse, UserLogin, UserRegister, GoogleAuth } from './post';
import { toast } from 'sonner';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to map MongoDB/Mongoose response to Frontend Post type
function mapPost(p: any): Post {
    return {
        ...p,
        id: p._id || p.id,
        categories: p.category_id,
        // Map populated User to authors prop
        authors: p.author_id,
        published_at: p.published_at,
        created_at: p.created_at,
        updated_at: p.updated_at
    };
}

// Generic API call function
async function apiCall<T>(url: string, method: string, data?: any, token?: string): Promise<T | null> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
            cache: 'no-store',
        });

        const responseData = await res.json();

        if (!res.ok) {
            const errorMessage = responseData.message || responseData.errors?.map((err: any) => err.msg).join(', ') || 'Something went wrong';
            if (typeof window !== 'undefined') {
                toast.error(errorMessage);
            } else {
                console.error(`API Error: ${errorMessage}`);
            }
            return null;
        }
        return responseData as T;
    } catch (error: any) {
        if (typeof window !== 'undefined') {
            toast.error(error.message || 'Network error or server is down');
        } else {
            console.error(`Network Error: ${error.message}`);
        }
        return null;
    }
}

// AUTH API CALLS
export async function loginUser(credentials: UserLogin): Promise<AuthResponse | null> {
    return apiCall<AuthResponse>(`${API_URL}/auth/login`, 'POST', credentials);
}

export async function registerUser(userData: UserRegister): Promise<AuthResponse | null> {
    return apiCall<AuthResponse>(`${API_URL}/auth/signup`, 'POST', userData);
}

export async function googleAuth(token: string): Promise<AuthResponse | null> {
    return apiCall<AuthResponse>(`${API_URL}/auth/google`, 'POST', { token });
}

export async function getPosts(): Promise<Post[]> {
    try {
        const res = await fetch(`${API_URL}/posts`, { cache: 'no-store' });
        if (!res.ok) {
            const errorData = await res.json();
            if (typeof window !== 'undefined') toast.error(errorData.message || 'Failed to fetch posts');
            return [];
        }
        const data = await res.json();
        return data.posts.map(mapPost);
    } catch (error) {
        if (typeof window !== 'undefined') toast.error('Error fetching posts (Backend might be down).');
        return [];
    }
}

export async function getFeaturedPosts(): Promise<Post[]> {
    try {
        const res = await fetch(`${API_URL}/posts/featured`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) {
            const errorData = await res.json();
            if (typeof window !== 'undefined') toast.error(errorData.message || 'Failed to fetch featured posts');
            return [];
        }
        return data.map(mapPost);
    } catch (error) {
        if (typeof window !== 'undefined') toast.error('Error fetching featured posts.');
        return [];
    }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        const res = await fetch(`${API_URL}/posts/${slug}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) {
            const errorData = await res.json();
            if (typeof window !== 'undefined') toast.error(errorData.message || `Failed to fetch post ${slug}`);
            return null;
        }
        return mapPost(data);
    } catch (error) {
        if (typeof window !== 'undefined') toast.error(`Error fetching post ${slug}.`);
        return null;
    }
}

export async function getLatestPosts(): Promise<Post[]> {
    return getPosts();
}

// CATEGORY API CALLS
export async function getCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
        if (!res.ok) {
            const errorData = await res.json();
            if (typeof window !== 'undefined') toast.error(errorData.message || 'Failed to fetch categories');
            return [];
        }
        return await res.json();
    } catch (error) {
        if (typeof window !== 'undefined') toast.error('Error fetching categories (Backend might be down).');
        return [];
    }
}

export async function createCategory(categoryData: { name: string }, token: string): Promise<Category | null> {
    return apiCall<Category>(`${API_URL}/categories`, 'POST', categoryData, token);
}

export async function updateCategory(id: string, categoryData: { name: string }, token: string): Promise<Category | null> {
    return apiCall<Category>(`${API_URL}/categories/${id}`, 'PUT', categoryData, token);
}

export async function deleteCategory(id: string, token: string): Promise<{ message: string } | null> {
    return apiCall<{ message: string }>(`${API_URL}/categories/${id}`, 'DELETE', undefined, token);
}

// NEWSLETTER API CALLS
export async function subscribeToNewsletter(email: string): Promise<{ message: string } | null> {
    return apiCall<{ message: string }>(`${API_URL}/newsletter`, 'POST', { email });
}

