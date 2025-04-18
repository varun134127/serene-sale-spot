
# E-commerce Backend with NestJS

This is the backend for our e-commerce application built with NestJS, Prisma, and MySQL.

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MySQL database
- Razorpay account for payment integration

### Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
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

4. Run Prisma migrations and seed the database:
```bash
npx prisma migrate dev --name init
```

5. Start the development server:
```bash
npm run start:dev
```

The server will be running at `http://localhost:3000`.

## Available Endpoints

### Authentication
- `POST /auth/login` - Login with username/password
- `GET /auth/google` - Initiate Google SSO
- `GET /auth/google/callback` - Google SSO callback

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get a specific product

### Cart
- `GET /cart` - Get cart items (requires authentication)
- `POST /cart` - Add an item to cart (requires authentication)
- `DELETE /cart/:id` - Remove an item from cart (requires authentication)
- `PATCH /cart/:id` - Update item quantity (requires authentication)

### Orders
- `POST /orders` - Create an order with Razorpay (requires authentication)
- `POST /orders/verify` - Verify Razorpay payment (requires authentication)
- `GET /orders` - Get order history (requires authentication)

## Testing Payments

Use the following test card for Razorpay:
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: 123

