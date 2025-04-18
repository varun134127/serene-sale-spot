
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create products
  const products = [
    {
      name: 'Laptop',
      price: 50000,
      description: 'Powerful laptop with 16GB RAM, 512GB SSD, and a fast processor.',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1470&auto=format&fit=crop',
    },
    {
      name: 'Smartphone',
      price: 20000,
      description: 'Latest smartphone with high-resolution camera and all-day battery life.',
      image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=1467&auto=format&fit=crop',
    },
    {
      name: 'Wireless Headphones',
      price: 3000,
      description: 'Premium wireless headphones with active noise cancellation.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop',
    },
    {
      name: 'Smart Watch',
      price: 5000,
      description: 'Fitness tracker with heart rate monitor and sleep tracking.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1399&auto=format&fit=crop',
    },
    {
      name: 'Gaming Console',
      price: 35000,
      description: 'Next-generation gaming console with 4K graphics and 1TB storage.',
      image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1619&auto=format&fit=crop',
    },
    {
      name: 'Digital Camera',
      price: 25000,
      description: 'Professional-grade digital camera with interchangeable lenses.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1538&auto=format&fit=crop',
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Database seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
