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
import {
  ProductAttributesDto,
  ProductItemDto,
} from '@shop/shared/dto/product.dto';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ type: String, default: '' })
  @IsString()
  @Length(2, 400)
  title!: string;

  @Prop({ type: String, default: '' })
  @IsString()
  description!: string;

  @Prop({ type: Array, default: [] })
  @IsArray()
  categories!: ObjectId[];

  @Prop({ type: Array, default: [] })
  @IsArray()
  items!: ProductItemDto[];

  @Prop({ type: Object, default: {} })
  @IsObject()
  attrs!: ProductAttributesDto;

  @Prop({ type: Number, default: 0 })
  @IsInt()
  @Min(0)
  quantity!: number;

  @Prop({ type: Number, default: 0 })
  @IsInt()
  @Min(0)
  price!: number;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  active!: boolean;

  // @Prop({ type: Object })
  // @IsObject()
  // imagesByColor: { [value in ItemColor]?: string[] } = {};

  @Prop({ type: Date, default: new Date() })
  @IsDate()
  createDate!: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('save', function (next) {
  // Sum items quantity
  this.quantity = this.items.reduce((acc, i) => acc + i.quantity, 0);

  const aggregatedAttrs = this.items
    .flatMap((i) => Object.entries(i.attributes))
    .reduce<{ [index: string]: Set<string> }>((acc, [key, values]) => {
      if (!acc[key]) {
        acc[key] = new Set();
      }
      values.forEach((v) => acc[key].add(v));
      return acc;
    }, {});

  this.attrs = Object.entries(aggregatedAttrs).reduce<ProductAttributesDto>(
    (acc, [key, values]: [string, Set<string>]) => ({
      ...acc,
      [key]: [...values.values()],
    }),
    {},
  );
  console.log(aggregatedAttrs);
  console.log(this.attrs);
  next();
});
