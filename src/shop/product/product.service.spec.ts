import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { AppModule } from '../../app.module';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      // providers: [
      //   ProductService,
      //   {
      //     provide: getRepositoryToken(ProductEntity),
      //     useValue: {},
      //   },
      // ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(ProductService);
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
    expect(result.name).toEqual('Test');
  });
});
