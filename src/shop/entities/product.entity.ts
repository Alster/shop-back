import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { ItemSize } from '../constants/item.constants';

export class Item {
  @Column()
  @IsNotEmpty()
  color!: string;

  @Column()
  @IsEnum(ItemSize)
  size!: ItemSize;
}

@Entity()
export class ProductEntity extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectID;

  @Column()
  @IsString()
  @Length(2, 400)
  name!: string;

  @Column((type) => Item)
  @IsArray()
  @ValidateNested({ each: true })
  items!: Item[];

  @Column()
  @IsInt()
  @Min(0)
  price!: number;

  @Column()
  @IsInt()
  @Min(0)
  quantity!: number;

  @Column()
  @IsDate()
  createDate: Date = new Date();
}
