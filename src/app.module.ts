import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopModule } from './shop/shop.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Config } from './config/config';
import { validateAndThrow } from '../shop_shared_server/helpers/validate-and-throw';
import mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(Config.get().mongo.url, Config.get().mongo.options),
    ShopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
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
