
import { useState } from 'react';
import { CartItem as CartItemType } from '@/types/api';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart, isLoading } = useCart();
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setLocalQuantity(newQuantity);
    await updateQuantity(item.id, newQuantity);
  };
  
  const handleRemove = () => {
    removeFromCart(item.id);
  };
  
  return (
    <div className="flex items-center py-4 border-b">
      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden mr-4">
        {item.product.image ? (
          <img 
            src={item.product.image} 
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No image
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium">{item.product.name}</h3>
        <p className="text-sm text-gray-500">₹{item.product.price.toLocaleString()} each</p>
      </div>
      
      <div className="flex items-center mr-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(localQuantity - 1)}
          disabled={localQuantity <= 1 || isLoading}
          aria-label="Decrease quantity"
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="mx-2 w-8 text-center">{localQuantity}</span>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(localQuantity + 1)}
          disabled={isLoading}
          aria-label="Increase quantity"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="w-24 text-right font-medium">
        ₹{(item.product.price * localQuantity).toLocaleString()}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="ml-4 text-gray-400 hover:text-red-500"
        onClick={handleRemove}
        disabled={isLoading}
        aria-label="Remove item"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CartItem;
