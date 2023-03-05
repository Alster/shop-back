import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import {
  IsArray,
  IsBoolean,
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

export type Item = { _id: ObjectID } & { [index: string]: string[] };

// export class Category {
//   @IsString()
//   @IsNotEmpty()
//   name!: string;
// }

@Entity()
export class ProductEntity extends BaseEntity {
  @ObjectIdColumn()
  id!: ObjectID;

  @Column()
  @IsString()
  @Length(2, 400)
  title!: string;

  @Column()
  @IsArray()
  categories!: string[];

  @Column()
  @IsArray()
  items!: Item[];

  @Column()
  @IsInt()
  @Min(0)
  quantity!: number;

  @Column()
  @IsInt()
  @Min(0)
  price!: number;

  @Column()
  @IsBoolean()
  active = false;

  @Column()
  @IsDate()
  createDate: Date = new Date();
}
