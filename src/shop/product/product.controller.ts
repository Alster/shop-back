import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ProductListResponseDto } from '@shop/shared/dto/product-list.response.dto';
import { ProductDto } from '@shop/shared/dto/product.dto';
import { CreateProductRequestDto } from '../dto/create-product.request.dto';
import { ProductService } from './product.service';
import { mapProductDocumentToProductDto } from '../mapper/map.productDocument-to-productDto';
import { AttributeDto } from '@shop/shared/dto/attribute.dto';
import { mapAttributeDocumentToAttributeDTO } from '../mapper/map.attributeDocument-to-attributeDTO';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  private logger: Logger = new Logger(ProductController.name);

  @Post('create')
  async postCreate(
    @Body() createProductRequestDto: CreateProductRequestDto,
  ): Promise<ProductDto> {
    this.logger.log(JSON.stringify(createProductRequestDto, null, 2));
    const res = await this.productService.createProduct(
      createProductRequestDto,
    );

    return mapProductDocumentToProductDto(res);
  }

  @Post('update/:id')
  async postUpdate(
    @Body() updateData: ProductDto,
    @Param('id') id: string,
  ): Promise<ProductDto> {
    const res = await this.productService.updateProduct(id, updateData);
    if (!res) {
      throw new Error(`Product not found with id ${id}`);
    }
    return mapProductDocumentToProductDto(res);
  }

  @Get('get/:id')
  async getProduct(@Param('id') id: string): Promise<ProductDto> {
    const res = await this.productService.getProduct(id);
    if (!res) {
      throw new Error(`Product not found with id ${id}`);
    }
    return mapProductDocumentToProductDto(res);
  }

  @Post('delete/:id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productService.deleteProduct(id);
  }

  @Get('list')
  async list(): Promise<ProductListResponseDto> {
    return await this.productService.find({});
  }

  @Get('attributes')
  async getAttributes(): Promise<AttributeDto[]> {
    const res = await this.productService.getAttributes();
    return res.map(mapAttributeDocumentToAttributeDTO);
  }
}
