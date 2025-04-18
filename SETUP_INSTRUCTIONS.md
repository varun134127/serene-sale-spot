
# Complete E-commerce Website Setup Instructions

This document provides detailed instructions for setting up both the frontend (React) and backend (NestJS) components of the e-commerce application.

## Frontend Setup (React)

### Option 1: Using the Current Repository

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be accessible at `http://localhost:5173`.

### Option 2: Setup from Scratch with Vite

1. Create a new Vite project:
```bash
npm create vite@latest my-ecommerce-frontend -- --template react-ts
cd my-ecommerce-frontend
```

2. Install required dependencies:
```bash
npm install react-router-dom axios tailwindcss postcss autoprefixer
```

3. Set up Tailwind CSS:
```bash
npx tailwindcss init -p
```

4. Configure Tailwind in `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

5. Add Tailwind directives to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

6. Create the project structure and copy the components and pages from this repository

## Backend Setup (NestJS)

1. Install NestJS CLI globally:
```bash
npm install -g @nestjs/cli
```

2. Create a new NestJS project:
```bash
nest new ecommerce-backend
cd ecommerce-backend
```

3. Install required dependencies:
```bash
npm install @nestjs/passport passport passport-jwt passport-local passport-google-oauth20 @nestjs/jwt bcrypt
npm install @prisma/client
npm install -D prisma
npm install razorpay
npm install class-validator class-transformer
```

4. Initialize Prisma:
```bash
npx prisma init
```

5. Copy the Prisma schema from `backend/prisma/schema.prisma` in this repository to your project.

6. Set up your MySQL database and update the `.env` file with your database connection string:
```
DATABASE_URL="mysql://username:password@localhost:3306/ecommerce"
```

7. Run Prisma migrations to create your database tables:
```bash
npx prisma migrate dev --name init
```

8. Seed the database with initial products:
```bash
npx prisma db seed
```

9. Set up environment variables in `.env`:
```
DATABASE_URL="mysql://username:password@localhost:3306/ecommerce"
JWT_SECRET="your-jwt-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
FRONTEND_URL="http://localhost:5173"
```

10. Start the backend development server:
```bash
npm run start:dev
```

The backend will be accessible at `http://localhost:3000`.

## Integrating Razorpay

1. Sign up for a Razorpay account at https://razorpay.com

2. Create API keys from the Razorpay dashboard:
   - Go to Settings > API Keys
   - Generate Test mode keys for development
   - Add these keys to your backend .env file

3. Test payments using the following test card:
   - Card Number: 4111 1111 1111 1111
   - Expiry: Any future date
   - CVV: 123
   - Name: Any name

## Setting up Google OAuth

1. Create a project in Google Cloud Console:
   - Go to https://console.cloud.google.com
   - Create a new project
   - Enable the Google OAuth API
   - Create OAuth consent screen
   - Create credentials (OAuth client ID)
   - Add authorized redirect URIs: `http://localhost:3000/auth/google/callback`

2. Add the Client ID and Client Secret to your backend .env file

## Running the Complete Application

1. Start the NestJS backend:
```bash
cd backend
npm run start:dev
```

2. In a separate terminal, start the React frontend:
```bash
npm run dev
```

3. Access the application at `http://localhost:5173`

## Next Steps

- Add more error handling and validation
- Implement user registration
- Add product categories and filtering
- Implement product search
- Add admin panel for product management
- Add more payment methods
