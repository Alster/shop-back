import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Config } from './config/config';

@Module({
  imports: [MongooseModule.forRoot(Config.get().mongo.url)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
