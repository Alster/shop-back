import { Injectable, Logger } from '@nestjs/common';
import { Item, ProductEntity } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemSize } from '../constants/item.constants';
import { CreateProductRequestDto } from '../dto/create-product.request.dto';

@Injectable()
export class ProductService {
  private logger: Logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private itemsRepository: Repository<ProductEntity>,
  ) {
    void this.doSomething();
  }

  public async createProduct(
    createProductRequestDto: CreateProductRequestDto,
  ): Promise<ProductEntity> {
    const someItem = new Item();
    someItem.color = 'red';
    someItem.size = ItemSize.L;

    const productEntity = new ProductEntity();
    productEntity.name = createProductRequestDto.name;
    productEntity.price = createProductRequestDto.price;
    productEntity.quantity = 10;
    productEntity.items = [someItem];
    await productEntity.save();
    this.logger.log(JSON.stringify(productEntity, null, 2));

    return productEntity;
  }

  private async doSomething(): Promise<void> {
    // const itemEntity = new ProductEntity();
    // itemEntity.name = 'Test';
    // await this.itemsRepository.save(itemEntity);
    // console.log(itemEntity);

    const someItem = new Item();
    someItem.color = 'red';
    someItem.size = ItemSize.L;

    const itemEntity = new ProductEntity();
    itemEntity.name = 'Test';
    itemEntity.price = 100;
    itemEntity.quantity = 10;
    itemEntity.items = [someItem];
    await itemEntity.save();
    this.logger.log(JSON.stringify(itemEntity, null, 2));
  }
}
