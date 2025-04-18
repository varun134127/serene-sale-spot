
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createOrder, initiatePayment, verifyPayment } from '@/services/razorpay';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Calculate total amount
  const deliveryFee = 100;
  const totalAmount = subtotal + deliveryFee;
  
  const handleCheckout = async () => {
    if (!name || !email || !address) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create Razorpay order
      const orderData = await createOrder(totalAmount);
      
      // Initiate payment
      await initiatePayment(
        orderData,
        { name, email },
        async (paymentId, orderId, signature) => {
          // Verify payment on success
          const verified = await verifyPayment(paymentId, orderId, signature);
          
          if (verified) {
            try {
              // Update order status in our database
              await api.post('/orders/confirm', {
                razorpayOrderId: orderId,
                razorpayPaymentId: paymentId,
                razorpaySignature: signature,
              });
              
              // Clear cart and show success message
              clearCart();
              toast({
                title: 'Payment successful!',
                description: 'Your order has been placed successfully.',
              });
              
              // Redirect to orders page
              navigate('/orders');
            } catch (error) {
              console.error('Failed to confirm order:', error);
              toast({
                title: 'Error',
                description: 'Payment was successful but failed to update order status.',
                variant: 'destructive',
              });
            }
          } else {
            setError('Payment verification failed. Please try again.');
          }
        },
        (error) => {
          console.error('Payment failed:', error);
          setError('Payment failed. Please try again.');
        }
      );
    } catch (error) {
      console.error('Checkout failed:', error);
      setError('Failed to initiate checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <Button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St, Apartment 4B"
                      required
                    />
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Items ({items.length})</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery Fee</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Pay Now'}
                </Button>
                
                <div className="mt-4 text-xs text-center text-gray-500">
                  <p>Secure payment powered by Razorpay</p>
                  <p>You'll be redirected to complete the payment</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Checkout;
