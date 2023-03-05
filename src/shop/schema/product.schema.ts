import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ObjectId } from 'mongodb';

export type ProductDocument = HydratedDocument<Product>;

export type Item = { _id: ObjectId } & { [index: string]: string[] };

@Schema()
export class Product {
  @Prop({ type: String })
  @IsString()
  @Length(2, 400)
  title = '';

  @Prop({ type: Array })
  @IsArray()
  categories: string[] = [];

  @Prop({ type: Array })
  @IsArray()
  items: Item[] = [];

  @Prop({ type: Number })
  @IsInt()
  @Min(0)
  quantity = 0;

  @Prop({ type: Number })
  @IsInt()
  @Min(0)
  price = 0;

  @Prop({ type: Boolean })
  @IsBoolean()
  active = false;

  @Prop({ type: Date })
  @IsDate()
  createDate: Date = new Date();
}

export const ProductSchema = SchemaFactory.createForClass(Product);
