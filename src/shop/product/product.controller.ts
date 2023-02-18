import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductRequestDto } from '../dto/create-product.request.dto';

@Controller('product')
export class ProductController {
  @Post('hello')
  getHello(@Body() createProductRequestDto: CreateProductRequestDto): string {
    console.log(createProductRequestDto);
    return 'Hello World!';
  }
}
