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
    // void this.doSomething();
  }

  public async createProduct(
    createProductRequestDto: CreateProductRequestDto,
  ): Promise<ProductEntity> {
    // const someItem = new Item();
    // someItem.color = 'red';
    // someItem.size = ItemSize.L;

    const manager = ProductEntity.getRepository().manager;

    const productEntity = new ProductEntity();
    productEntity.title = createProductRequestDto.name;
    productEntity.price = createProductRequestDto.price;
    productEntity.quantity = 10;
    productEntity.items = [];
    productEntity.categories = [];
    await productEntity.save();
    this.logger.log(JSON.stringify(productEntity, null, 2));
    this.logger.log('Product created');

    await Promise.all([
      manager.transaction(async (transactionalEntityManager) => {
        this.logger.log('Transaction started');
        // Get product repository
        const productRepository =
          transactionalEntityManager.getRepository(ProductEntity);
        // Get product
        const foundProductEntity = await productRepository.findOneById(
          productEntity.id,
        );

        await new Promise((resolve) => setTimeout(resolve, 4000));

        this.logger.log('Saving in transaction');

        foundProductEntity!.title = 'Updated in transaction';
        await foundProductEntity!.save();

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }),
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.logger.log('Saving outside transaction');
        // Update the product
        productEntity.title = 'Updated';
        await productEntity.save();
      })(),
    ]);

    return productEntity;
  }

  private async doSomething(): Promise<void> {
    // const itemEntity = new ProductEntity();
    // itemEntity.name = 'Test';
    // await this.itemsRepository.save(itemEntity);
    // console.log(itemEntity);

    const itemEntity = new ProductEntity();
    itemEntity.title = 'Test';
    itemEntity.price = 100;
    itemEntity.quantity = 10;
    itemEntity.items = [];
    itemEntity.categories = [];
    await itemEntity.save();
    this.logger.log(JSON.stringify(itemEntity, null, 2));
  }
}
