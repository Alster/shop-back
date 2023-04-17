import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsObject,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { AttributeType } from '../../constants/product';
import { TranslatedText } from '@shop/shared/dto/translated-text';

export interface AttributeValueDto {
  key: string;
  title: TranslatedText;
}

export type ItemAttributeDocument = HydratedDocument<ItemAttribute>;

@Schema()
export class ItemAttribute {
  @Prop({ type: String })
  @IsString()
  @Length(2, 400)
  title = '';

  @Prop({ type: String })
  @IsString()
  description = '';

  @Prop({ type: String, index: true })
  @IsString()
  @Length(2, 40)
  key = '';

  @Prop({ type: String })
  @IsEnum(AttributeType)
  type!: AttributeType;

  @Prop({ type: Array })
  values: AttributeValueDto[] = [];

  @Prop({ type: Boolean })
  @IsBoolean()
  active = false;

  @Prop({ type: Date })
  @IsDate()
  createDate: Date = new Date();
}

export const ItemAttributeSchema = SchemaFactory.createForClass(ItemAttribute);
