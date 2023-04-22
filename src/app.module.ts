import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopModule } from './shop/shop.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Config } from './config/config';
import { validateAndThrow } from './helpers/validateAndThrow';
import { CategoryService } from './shop/category/category.service';
import { CategoryController } from './shop/category/category.controller';
import mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(Config.get().mongo.url, Config.get().mongo.options),
    ShopModule,
  ],
  controllers: [AppController, CategoryController],
  providers: [AppService, CategoryService],
})
export class AppModule {
  constructor() {
    mongoose.plugin((schema, options) => {
      schema.post('save', async (doc) => {
        await validateAndThrow(doc);
      });
    });
  }
}
