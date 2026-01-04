import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Post from '../models/Post.js';
import logger from '../config/logger.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ovanthra-blog';

// Dummy data
const categories = [
    { name: 'Technology', slug: 'technology' },
    { name: 'Design', slug: 'design' },
    { name: 'Business', slug: 'business' },
    { name: 'Marketing', slug: 'marketing' },
    { name: 'Development', slug: 'development' },
    { name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
];

const users = [
    {
        name: 'Admin User',
        email: 'admin@ovanthra.com',
        password: 'admin123',
        role: 'admin',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        bio: 'Administrator and founder of Ovanthra Blog'
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        bio: 'Tech enthusiast and software developer'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        bio: 'UI/UX Designer and creative thinker'
    },
    {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'user',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        bio: 'Business analyst and startup mentor'
    }
];

const posts = [
    {
        title: 'Getting Started with React and TypeScript',
        slug: 'getting-started-with-react-and-typescript',
        excerpt: 'Learn how to build modern web applications using React and TypeScript together.',
        content: `
# Getting Started with React and TypeScript

TypeScript has become an essential tool for building robust React applications. In this comprehensive guide, we'll explore how to set up and use TypeScript with React effectively.

## Why TypeScript?

TypeScript adds static typing to JavaScript, which helps catch errors early in the development process. When combined with React, it provides:

- Better IDE support and autocomplete
- Improved code maintainability
- Enhanced refactoring capabilities
- Reduced runtime errors

## Setting Up Your Project

To get started, you can use Create React App with TypeScript template:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

## Type Safety in Components

Here's an example of a typed React component:

\`\`\`typescript
interface Props {
  name: string;
  age: number;
}

const UserCard: React.FC<Props> = ({ name, age }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
};
\`\`\`

## Conclusion

TypeScript makes React development more predictable and maintainable. Start using it in your next project!
        `,
        image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        status: 'published',
        featured: true,
        read_time: 8,
        category: 'development'
    },
    {
        title: 'The Future of Artificial Intelligence in 2024',
        slug: 'future-of-artificial-intelligence-2024',
        excerpt: 'Exploring the latest trends and predictions for AI technology in the coming year.',
        content: `
# The Future of Artificial Intelligence in 2024

Artificial Intelligence continues to evolve at an unprecedented pace. Let's explore what's on the horizon.

## Key Trends

### 1. Generative AI Evolution
Large language models are becoming more sophisticated, enabling new use cases in content creation, code generation, and problem-solving.

### 2. AI in Healthcare
From diagnosis to drug discovery, AI is revolutionizing healthcare delivery and medical research.

### 3. Ethical AI Development
There's a growing focus on responsible AI development, addressing bias, transparency, and accountability.

## Impact on Industries

AI is transforming:
- **Finance**: Fraud detection and algorithmic trading
- **Manufacturing**: Predictive maintenance and quality control
- **Education**: Personalized learning experiences
- **Retail**: Customer service and inventory management

## Conclusion

The AI revolution is just beginning. Stay informed and embrace these technologies responsibly.
        `,
        image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        status: 'published',
        featured: true,
        read_time: 6,
        category: 'artificial-intelligence'
    },
    {
        title: 'Modern UI/UX Design Principles',
        slug: 'modern-ui-ux-design-principles',
        excerpt: 'Essential design principles every designer should know in 2024.',
        content: `
# Modern UI/UX Design Principles

Creating exceptional user experiences requires understanding fundamental design principles.

## Core Principles

### 1. User-Centered Design
Always put the user at the center of your design decisions. Understand their needs, goals, and pain points.

### 2. Consistency
Maintain consistency in:
- Visual elements
- Interaction patterns
- Terminology
- Layout structure

### 3. Accessibility
Design for everyone:
- Use sufficient color contrast
- Provide keyboard navigation
- Include alt text for images
- Support screen readers

### 4. Simplicity
Remove unnecessary elements. Every component should serve a purpose.

## Design Tools

Popular tools include:
- Figma for collaborative design
- Adobe XD for prototyping
- Sketch for Mac users
- Framer for interactive prototypes

## Conclusion

Great design is invisible. Focus on solving user problems, not adding features.
        `,
        image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        status: 'published',
        featured: false,
        read_time: 5,
        category: 'design'
    },
    {
        title: 'Building a Successful Startup: Lessons Learned',
        slug: 'building-successful-startup-lessons-learned',
        excerpt: 'Key insights from entrepreneurs who have successfully built and scaled startups.',
        content: `
# Building a Successful Startup: Lessons Learned

Starting a business is challenging, but these lessons can help you navigate the journey.

## Key Lessons

### 1. Solve Real Problems
Don't build solutions looking for problems. Identify real pain points and solve them elegantly.

### 2. Build a Strong Team
Your team is your greatest asset. Hire people who:
- Share your vision
- Complement your skills
- Challenge your assumptions
- Execute relentlessly

### 3. Focus on Product-Market Fit
Before scaling, ensure your product truly resonates with your target market.

### 4. Manage Cash Flow
Cash is king. Always know:
- Your burn rate
- Runway remaining
- Revenue projections
- Cost structure

## Common Mistakes to Avoid

- Scaling too early
- Ignoring customer feedback
- Underestimating competition
- Losing focus on core product

## Conclusion

Success comes from persistence, learning, and adapting. Stay focused on creating value.
        `,
        image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
        status: 'published',
        featured: false,
        read_time: 7,
        category: 'business'
    },
    {
        title: 'Digital Marketing Strategies for 2024',
        slug: 'digital-marketing-strategies-2024',
        excerpt: 'Effective marketing strategies to grow your business online this year.',
        content: `
# Digital Marketing Strategies for 2024

The digital landscape is constantly evolving. Here are the strategies that work today.

## Content Marketing

### Create Valuable Content
Focus on:
- Educational blog posts
- How-to guides
- Case studies
- Video tutorials

### SEO Best Practices
- Optimize for search intent
- Build quality backlinks
- Improve page speed
- Use schema markup

## Social Media Marketing

### Platform Strategy
Choose platforms based on your audience:
- **LinkedIn**: B2B and professional content
- **Instagram**: Visual storytelling
- **Twitter**: Real-time engagement
- **TikTok**: Short-form video content

## Email Marketing

Build and nurture your email list:
- Segment your audience
- Personalize messages
- A/B test subject lines
- Automate campaigns

## Analytics and Measurement

Track key metrics:
- Conversion rates
- Customer acquisition cost
- Lifetime value
- ROI per channel

## Conclusion

Success in digital marketing requires consistency, creativity, and data-driven decision making.
        `,
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        status: 'published',
        featured: false,
        read_time: 6,
        category: 'marketing'
    },
    {
        title: 'Cloud Computing: AWS vs Azure vs Google Cloud',
        slug: 'cloud-computing-aws-azure-google-cloud',
        excerpt: 'A comprehensive comparison of the top three cloud service providers.',
        content: `
# Cloud Computing: AWS vs Azure vs Google Cloud

Choosing the right cloud provider is crucial for your infrastructure. Let's compare the big three.

## Amazon Web Services (AWS)

### Strengths
- Largest market share
- Most comprehensive service offering
- Mature ecosystem
- Extensive documentation

### Best For
- Startups and enterprises
- Complex, scalable applications
- Global deployments

## Microsoft Azure

### Strengths
- Excellent Windows integration
- Strong hybrid cloud capabilities
- Enterprise-friendly
- Great for .NET applications

### Best For
- Microsoft-centric organizations
- Hybrid cloud scenarios
- Enterprise applications

## Google Cloud Platform

### Strengths
- Superior data analytics
- Excellent Kubernetes support
- Competitive pricing
- Strong AI/ML offerings

### Best For
- Data-intensive applications
- Kubernetes workloads
- AI/ML projects

## Cost Comparison

All three providers offer:
- Pay-as-you-go pricing
- Reserved instances
- Spot/preemptible instances
- Free tiers for learning

## Conclusion

Each provider has unique strengths. Choose based on your specific needs, existing infrastructure, and team expertise.
        `,
        image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
        status: 'published',
        featured: true,
        read_time: 9,
        category: 'technology'
    },
    {
        title: 'Introduction to Machine Learning',
        slug: 'introduction-to-machine-learning',
        excerpt: 'A beginner-friendly guide to understanding machine learning concepts.',
        content: `
# Introduction to Machine Learning

Machine Learning is transforming how we solve complex problems. Let's explore the basics.

## What is Machine Learning?

Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.

## Types of Machine Learning

### 1. Supervised Learning
- Trained on labeled data
- Examples: Classification, Regression
- Use cases: Spam detection, Price prediction

### 2. Unsupervised Learning
- Works with unlabeled data
- Examples: Clustering, Dimensionality reduction
- Use cases: Customer segmentation, Anomaly detection

### 3. Reinforcement Learning
- Learns through trial and error
- Examples: Game AI, Robotics
- Use cases: Self-driving cars, Trading bots

## Popular Algorithms

- Linear Regression
- Decision Trees
- Neural Networks
- Support Vector Machines
- K-Means Clustering

## Getting Started

Begin with:
1. Learn Python programming
2. Study statistics and linear algebra
3. Practice with datasets on Kaggle
4. Use libraries like scikit-learn and TensorFlow

## Conclusion

Machine Learning is accessible to everyone. Start small, practice consistently, and build real projects.
        `,
        image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
        status: 'published',
        featured: false,
        read_time: 7,
        category: 'artificial-intelligence'
    },
    {
        title: 'Responsive Web Design Best Practices',
        slug: 'responsive-web-design-best-practices',
        excerpt: 'Create websites that look great on all devices with these proven techniques.',
        content: `
# Responsive Web Design Best Practices

In today's mobile-first world, responsive design is essential. Here's how to do it right.

## Mobile-First Approach

Start with mobile design and progressively enhance for larger screens.

\`\`\`css
/* Mobile first */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}
\`\`\`

## Flexible Grids

Use CSS Grid and Flexbox for flexible layouts:

- Grid for page-level layouts
- Flexbox for component-level layouts

## Responsive Images

Optimize images for different screen sizes:

\`\`\`html
<picture>
  <source media="(min-width: 1024px)" srcset="large.jpg">
  <source media="(min-width: 768px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Responsive image">
</picture>
\`\`\`

## Performance Considerations

- Lazy load images
- Minimize CSS and JavaScript
- Use CDN for assets
- Implement caching strategies

## Testing

Test on:
- Real devices
- Browser DevTools
- Online testing tools
- Different network conditions

## Conclusion

Responsive design is about creating great experiences across all devices. Prioritize performance and user experience.
        `,
        image_url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800',
        status: 'published',
        featured: false,
        read_time: 6,
        category: 'development'
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        logger.info('Connected to MongoDB for seeding');

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Post.deleteMany({});
        logger.info('Cleared existing data');

        // Create categories
        const createdCategories = await Category.insertMany(categories);
        logger.info(`Created ${createdCategories.length} categories`);

        // Create users with hashed passwords
        const usersWithHashedPasswords = await Promise.all(
            users.map(async (user) => {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                return { ...user, password: hashedPassword };
            })
        );

        const createdUsers = await User.insertMany(usersWithHashedPasswords);
        logger.info(`Created ${createdUsers.length} users`);

        // Create posts with proper references
        const postsWithRefs = posts.map((post, index) => {
            const category = createdCategories.find(cat => cat.slug === post.category);
            const author = createdUsers[index % createdUsers.length]; // Distribute posts among users

            return {
                ...post,
                category_id: category?._id,
                author_id: author._id,
                image: post.image_url, // Duplicate for compatibility
                published_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
            };
        });

        const createdPosts = await Post.insertMany(postsWithRefs);
        logger.info(`Created ${createdPosts.length} posts`);

        logger.info('Database seeding completed successfully!');
        logger.info('---');
        logger.info('Test Credentials:');
        logger.info('Admin - Email: admin@ovanthra.com, Password: admin123');
        logger.info('User - Email: john@example.com, Password: password123');

        process.exit(0);
    } catch (error) {
        logger.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
