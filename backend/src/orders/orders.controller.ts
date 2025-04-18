
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.ordersService.createOrder(createOrderDto, req.user.id);
  }
  
  @Post('verify')
  verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto, @Req() req) {
    return this.ordersService.verifyPayment(verifyPaymentDto, req.user.id);
  }
  
  @Get()
  findAll(@Req() req) {
    return this.ordersService.findAllByUser(req.user.id);
  }
}
