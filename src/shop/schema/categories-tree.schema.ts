import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { TranslatedText } from '../../../shopshared/dto/translated-text';
import {
  ATTRIBUTE_TYPE,
  AttributeType,
} from '../../../shopshared/constants/product';
import { ObjectId } from 'mongodb';

export class CategoryNode {
  @Prop({ type: ObjectId })
  _id!: ObjectId;

  @Prop({ type: Object, default: {} })
  @IsObject()
  title!: TranslatedText;

  @Prop({ type: Object, default: {} })
  @IsObject()
  description!: TranslatedText;

  @Prop({ type: Array, default: [] })
  @IsArray({ each: true })
  children!: CategoryNode[];

  @Prop({ type: Number })
  @IsNumber()
  sort!: number;

  @Prop({ type: Boolean })
  @IsBoolean()
  active!: boolean;
}

export type CategoriesTreeDocument = HydratedDocument<CategoriesTree>;

@Schema()
export class CategoriesTree {
  @Prop({ type: Object, default: {} })
  @IsObject()
  tree!: CategoryNode;
}

export const CategoryTreeSchema = SchemaFactory.createForClass(CategoriesTree);
