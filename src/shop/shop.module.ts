import { Module } from '@nestjs/common';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { Product, ProductSchema } from './schema/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ItemAttribute,
  ItemAttributeSchema,
} from './schema/item-attribute.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ItemAttribute.name, schema: ItemAttributeSchema },
    ]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ShopModule {}
