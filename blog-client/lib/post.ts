
export type Post = {
  _id: string; // Mongo ID
  id?: string; // Virtual
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  image?: string;
  status?: 'draft' | 'published';
  category_id: string | Category;
  author_id: string | Author;
  // Convenience accessors for populated refs
  categories?: Category;
  authors?: Author;
  featured: boolean;
  read_time: number;
  published_at: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  _id: string; // Mongo ID
  id?: string; // Virtual
  name: string;
  slug: string;
  created_at?: string;
};

export type Author = {
  _id: string; // User ID from MongoDB
  name: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  avatar?: string;
  bio?: string;
};

export type AuthResponse = {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  avatar?: string;
  bio?: string;
};

export type UserLogin = {
  email: string;
  password: string;
};

export type UserRegister = {
  name: string;
  email: string;
  password: string;
};

export type GoogleAuth = {
  token: string;
};


