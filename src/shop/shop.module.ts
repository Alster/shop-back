import { Module } from '@nestjs/common';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { Product, ProductSchema } from './schema/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ItemAttribute,
  ItemAttributeSchema,
} from './schema/item-attribute.schema';
import {
  CategoriesTree,
  CategoriesTreeSchema,
} from './schema/categories-tree.schema';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ItemAttribute.name, schema: ItemAttributeSchema },
      { name: CategoriesTree.name, schema: CategoriesTreeSchema },
    ]),
  ],
  providers: [ProductService, CategoryService],
  controllers: [ProductController, CategoryController],
})
export class ShopModule {}
