import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopModule } from './shop/shop.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Config } from './config/config';
import { GlobalEntitySubscriber } from './helpers/validateAndThrow';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      url: Config.get().mongo.url,
      database: 'test',
      type: 'mongodb',
      logging: true,
      subscribers: [GlobalEntitySubscriber],
    }),
    ShopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
