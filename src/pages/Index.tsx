
import { useEffect, useState } from 'react';
import { Product } from '@/types/api';
import api from '@/lib/axios';
import ProductCard from '@/components/products/ProductCard';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get<Product[]>('/products');
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Display temporary mock products while we don't have the backend connected
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      price: 50000,
      description: 'Powerful laptop with 16GB RAM, 512GB SSD, and a fast processor.',
    },
    {
      id: 2,
      name: 'Smartphone',
      price: 20000,
      description: 'Latest smartphone with high-resolution camera and all-day battery life.',
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      price: 3000,
      description: 'Premium wireless headphones with active noise cancellation.',
    },
    {
      id: 4,
      name: 'Smart Watch',
      price: 5000,
      description: 'Fitness tracker with heart rate monitor and sleep tracking.',
    },
    {
      id: 5,
      name: 'Gaming Console',
      price: 35000,
      description: 'Next-generation gaming console with 4K graphics and 1TB storage.',
    },
    {
      id: 6,
      name: 'Digital Camera',
      price: 25000,
      description: 'Professional-grade digital camera with interchangeable lenses.',
    },
  ];
  
  const displayProducts = products.length > 0 ? products : mockProducts;
  
  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Featured Products</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map(product => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
