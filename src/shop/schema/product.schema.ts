import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsObject,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { ItemColor } from '../constants/product.constants';
import { ProductItem } from './product.item';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ type: String })
  @IsString()
  @Length(2, 400)
  title = '';

  @Prop({ type: String })
  @IsString()
  description = '';

  @Prop({ type: Array })
  @IsArray()
  categories: ObjectId[] = [];

  @Prop({ type: Array })
  @IsArray()
  items: ProductItem[] = [];

  @Prop({ type: Number })
  @IsInt()
  @Min(0)
  quantity!: number;

  @Prop({ type: Number })
  @IsInt()
  @Min(0)
  price!: number;

  @Prop({ type: Boolean })
  @IsBoolean()
  active = false;

  @Prop({ type: Object })
  @IsObject()
  imagesByColor: { [value in ItemColor]?: string[] } = {};

  @Prop({ type: Date })
  @IsDate()
  createDate: Date = new Date();
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('save', function (next) {
  if (this.quantity !== this.items.length) {
    console.log(
      `Quantity changed from ${this.quantity} to ${this.items.length}`,
    );
    this.quantity = this.items.length;
  }
  next();
});
