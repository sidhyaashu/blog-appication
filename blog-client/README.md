# Horizone Blog Application

A modern, full-featured blog application built with Next.js 13, TypeScript, Tailwind CSS, and Supabase.

## Features

- Modern, responsive design matching the provided design specifications
- Hero section with search functionality
- Blog post grid layout with category badges
- Featured and Latest post sidebars
- Newsletter subscription with email validation
- Individual blog post pages with author information
- Full database integration with Supabase
- Row Level Security (RLS) for data protection

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Image Optimization**: Next.js Image component
- **Icons**: Lucide React

## Database Schema

The application uses four main tables:

1. **categories** - Blog post categories
2. **authors** - Blog post authors with avatars
3. **posts** - Main blog posts table with relationships
4. **newsletter_subscribers** - Newsletter email subscriptions

All tables have Row Level Security enabled with public read access for published content.

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### 2. Supabase Setup

The database schema has already been created via migrations. Your Supabase database includes:

- All necessary tables (categories, authors, posts, newsletter_subscribers)
- Sample data for testing
- Row Level Security policies

### 3. Environment Variables

Update the `.env.local` file with your actual Supabase credentials:

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
\`\`\`

You can find these values in your Supabase project dashboard under Settings > API.

### 4. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 5. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 6. Build for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx          # Root layout with Header and Footer
│   ├── page.tsx            # Home page with blog grid
│   └── blog/
│       └── [slug]/
│           └── page.tsx    # Individual blog post page
├── components/
│   ├── header.tsx          # Navigation header
│   ├── hero-section.tsx    # Hero section with search
│   ├── blog-card.tsx       # Blog post card component
│   ├── featured-post.tsx   # Featured post sidebar item
│   ├── newsletter.tsx      # Newsletter subscription form
│   └── footer.tsx          # Footer with links and social media
├── lib/
│   └── supabase.ts         # Supabase client and TypeScript types
└── .env.local              # Environment variables (not in git)
\`\`\`

## Key Features Explained

### Blog Grid Layout

The home page displays blog posts in a responsive grid with:
- Large image cards with overlay text
- Category badges
- Post titles and excerpts
- Hover animations

### Sidebar Components

- **Featured Posts**: Displays featured blog posts with thumbnails
- **Latest Posts**: Shows most recent posts
- **Newsletter**: Subscription form with email validation and privacy policy checkbox

### Individual Post Pages

Each blog post page includes:
- Full-width hero image with gradient overlay
- Category badge
- Post title and excerpt
- Author information with avatar
- Publication date and read time
- Full post content

### Newsletter Subscription

- Email validation
- Privacy policy agreement checkbox
- Toast notifications for success/error states
- Duplicate email prevention

## Customization

### Adding New Posts

Posts are managed in Supabase. To add new posts:

1. Go to your Supabase dashboard
2. Navigate to the Table Editor
3. Add entries to the `posts` table
4. Ensure you link to valid `category_id` and `author_id`

### Styling

The application uses Tailwind CSS for styling. Key color schemes:
- Primary blue: `bg-blue-600` (buttons and accents)
- Dark slate: `bg-slate-700` (header)
- Neutral grays for text and backgrounds

### Images

All blog post images are sourced from Pexels. You can replace them with your own images by updating the `image_url` field in the posts table.

## License

This project is open source and available under the MIT License.
