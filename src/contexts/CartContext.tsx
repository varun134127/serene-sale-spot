
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../lib/axios';
import { Product, CartItem } from '../types/api';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Calculate derived values
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Fetch cart items when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    } else {
      // Clear cart when logged out
      setItems([]);
    }
  }, [isAuthenticated]);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<CartItem[]>('/cart');
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity = 1) => {
    try {
      setIsLoading(true);
      const { data } = await api.post<CartItem>('/cart', { productId: product.id, quantity });
      
      setItems(prev => [...prev, data]);
      
      toast({
        title: 'Added to cart',
        description: `${product.name} added to your cart`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setIsLoading(true);
      await api.delete(`/cart/${itemId}`);
      
      setItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: 'Removed from cart',
        description: 'Item removed from your cart',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove item from cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      await api.patch(`/cart/${itemId}`, { quantity });
      
      setItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update quantity',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await api.delete('/cart');
      setItems([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear cart',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
