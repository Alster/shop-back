import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateProductRequestDto } from '../dto/create-product.request.dto';

@Controller('product')
export class ProductController {
  private logger: Logger = new Logger(ProductController.name);

  @Post('create')
  postCreate(@Body() createProductRequestDto: CreateProductRequestDto): string {
    this.logger.log(JSON.stringify(createProductRequestDto, null, 2));
    return 'Hello World!';
  }
}
