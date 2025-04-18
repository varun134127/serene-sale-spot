
import api from '@/lib/axios';
import { RazorpayOrderResponse } from '@/types/api';

// Define interface for Razorpay options
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler?: (response: any) => void;
}

// Define Razorpay window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Function to load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

// Function to create an order
export const createOrder = async (amount: number): Promise<RazorpayOrderResponse> => {
  try {
    const { data } = await api.post<RazorpayOrderResponse>('/orders', { amount });
    return data;
  } catch (error) {
    console.error('Failed to create Razorpay order:', error);
    throw error;
  }
};

// Function to initialize payment
export const initiatePayment = async (
  orderData: RazorpayOrderResponse,
  userData: { name: string; email: string },
  onSuccess: (paymentId: string, orderId: string, signature: string) => void,
  onFailure: (error: any) => void
): Promise<void> => {
  // Ensure Razorpay script is loaded
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    onFailure(new Error('Failed to load Razorpay checkout script'));
    return;
  }
  
  // Configure payment options
  const options: RazorpayOptions = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'EcomShop',
    description: 'Purchase from EcomShop',
    order_id: orderData.orderId,
    prefill: {
      name: userData.name,
      email: userData.email,
    },
    theme: {
      color: '#2563eb', // blue-600
    },
    handler: function(response: any) {
      // Handle successful payment
      onSuccess(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature
      );
    },
    modal: {
      ondismiss: function() {
        onFailure(new Error('Payment cancelled by user'));
      }
    }
  };
  
  // Initialize Razorpay
  try {
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    onFailure(error);
  }
};

// Function to verify payment
export const verifyPayment = async (
  paymentId: string,
  orderId: string,
  signature: string
): Promise<boolean> => {
  try {
    const { data } = await api.post('/orders/verify', {
      paymentId,
      orderId,
      signature,
    });
    return data.verified;
  } catch (error) {
    console.error('Payment verification failed:', error);
    return false;
  }
};
