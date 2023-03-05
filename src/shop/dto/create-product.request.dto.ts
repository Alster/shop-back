import { IsInt, IsString, Length, Min } from 'class-validator';

export class CreateProductRequestDto {
  @IsString()
  @Length(2, 400)
  name!: string;

  @IsInt()
  @Min(0)
  price!: number;
}
