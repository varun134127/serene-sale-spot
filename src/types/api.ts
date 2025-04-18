
// API response types for our e-commerce application

export interface User {
  id: number;
  username: string;
  email: string;
  googleId?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  razorpayOrderId: string;
  status: OrderStatus;
  createdAt: string;
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}
