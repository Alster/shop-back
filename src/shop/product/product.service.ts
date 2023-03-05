import { Injectable, Logger } from '@nestjs/common';
import { Product, ProductDocument } from '../schema/product.schema';
import { CreateProductRequestDto } from '../dto/create-product.request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  private logger: Logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {
    // void this.doSomething();
  }

  public async createProduct(
    createProductRequestDto: CreateProductRequestDto,
  ): Promise<ProductDocument> {
    const product = await this.productModel.create({
      title: createProductRequestDto.name,
      price: createProductRequestDto.price,
      quantity: 10,
      items: [],
      categories: [],
    });
    this.logger.log('Product created');
    return product;
  }
}
