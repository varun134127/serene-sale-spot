
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: number) {
    // Verify user has items in cart
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException('No items in cart');
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    // Create the order
    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount,
        razorpayOrderId: createOrderDto.razorpayOrderId,
        status: 'PENDING',
        orderItems: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear the cart
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return order;
  }

  async verifyPayment(verifyPaymentDto: VerifyPaymentDto, userId: number) {
    const { razorpayOrderId } = verifyPaymentDto;

    // Find the order
    const order = await this.prisma.order.findFirst({
      where: {
        razorpayOrderId,
        userId,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Update order status to PAID
    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return updatedOrder;
  }

  async findAllByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
