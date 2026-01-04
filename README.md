# Ovanthra Blog Application

This is a full-stack blog application, consisting of a Next.js frontend (`blog-client`) and an Express.js/MongoDB backend (`blog-server`).

## Project Structure

- `blog-client/`: The Next.js frontend application.
- `blog-server/`: The Express.js backend API with MongoDB.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (local or cloud-hosted)

### Backend Setup (`blog-server`)

1.  **Navigate to the backend directory:**
    ```bash
    cd blog-server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file in the `blog-server` directory:**

    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/ovanthra-blog
    JWT_SECRET=your_jwt_secret_key
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=adminpassword
    GOOGLE_CLIENT_ID=your_google_client_id
    ```
    *Replace placeholder values with your actual secrets and configuration.*

4.  **Build the TypeScript code:**
    ```bash
    npm run build
    ```

5.  **Run the backend server:**
    ```bash
    npm run dev
    ```
    The server will run on `http://localhost:5000` (or your specified PORT).

### Frontend Setup (`blog-client`)

1.  **Navigate to the frontend directory:**
    ```bash
    cd blog-client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env.local` file in the `blog-client` directory:**

    ```
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
    ```
    *Ensure `NEXT_PUBLIC_API_URL` matches your backend server address.*

4.  **Run the frontend development server:**
    ```bash
    npm run dev
    ```
    The client application will run on `http://localhost:3000` (or the default Next.js port).

## Deployment

### Backend Deployment

1.  **Environment Variables:** Ensure all sensitive information (e.g., `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `GOOGLE_CLIENT_ID`) is securely configured as environment variables in your hosting environment (e.g., Vercel, Netlify, Render, AWS, Google Cloud).

2.  **Build for Production:**
    ```bash
    cd blog-server
    npm run build
    ```

3.  **Start Production Server:** The `dist/index.js` file will be your entry point. Your hosting provider should be configured to run `node dist/index.js`.

### Frontend Deployment

1.  **Environment Variables:** Configure `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BASE_URL`, and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in your hosting environment. These variables are crucial for the client to connect to your deployed backend and for correct SEO/OpenGraph tags.

2.  **Build for Production:**
    ```bash
    cd blog-client
    npm run build
    ```

3.  **Serve:** Deploy the `blog-client` application to a platform like Vercel, Netlify, or your preferred hosting provider. Next.js handles asset minification and optimization automatically during the build process.

## Testing

### Backend Tests

To run the server-side unit tests:

```bash
cd blog-server
npm test
```

## Contributing

Feel free to fork the repository, make improvements, and submit pull requests.

## License

This project is licensed under the ISC License.
