import { Module } from '@nestjs/common';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ShopModule {}
