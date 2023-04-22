import { IsArray, IsInt, IsString, Length, Min } from 'class-validator';
import { ProductItemDto } from '../../../shopshared/dto/product.dto';

export class CreateProductRequestDto {
  @IsString()
  @Length(2, 400)
  name!: string;

  @IsInt()
  @Min(0)
  price!: number;

  @IsArray()
  items: ProductItemDto[] = [];
}
