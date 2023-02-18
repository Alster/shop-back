import { Injectable } from '@nestjs/common';
import { Item, ProductEntity } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemSize } from '../constants/item.constants';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private itemsRepository: Repository<ProductEntity>,
  ) {
    console.log('ProductService.constructor()');
    void this.doSomething();
  }

  private async doSomething(): Promise<void> {
    console.log('doSomething()');

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
    console.log(itemEntity);
  }
}
