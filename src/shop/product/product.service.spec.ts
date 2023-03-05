import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import {
  Product,
  ProductDocument,
  ProductSchema,
} from '../schema/product.schema';
import { AppModule } from '../../app.module';
import { ConsoleLogger } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Model<ProductDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      // providers: [
      //   ProductService,
      //   {
      //     provide: getRepositoryToken(ProductSchema),
      //     useValue: {},
      //   },
      // ],
    })
      .setLogger(new ConsoleLogger())
      .compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get(getModelToken(Product.name));
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create a product', async () => {
    const result = await service.createProduct({
      name: 'Test',
      price: 100,
    });

    expect(result).toBeDefined();

    const foundProduct = await repository.findOne({
      _id: result._id,
    });
    expect(result.title).toEqual('Test');
    if (!foundProduct) throw new Error('Product not found');
    expect(foundProduct.title).toEqual('Test');
  });
});
