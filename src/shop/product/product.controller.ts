import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductRequestDto } from '../dto/create-product.request.dto';
import { ProductService } from './product.service';
import { mapAttributeDocumentToAttributeDTO } from '../mapper/map.attributeDocument-to-attributeDTO';
import { mapProductDocumentToProductAdminDto } from '../mapper/map.productDocument-to-productAdminDto';
import { ProductAdminDto } from '../../../shopshared/dto/product.dto';
import { ProductListResponseDto } from '../../../shopshared/dto/product-list.response.dto';
import { AttributeDto } from '../../../shopshared/dto/attribute.dto';
import { LanguageEnum } from '../../../shopshared/constants/localization';
import { MockColor } from './mocks';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  private logger: Logger = new Logger(ProductController.name);

  @Post('create')
  async postCreate(
    @Body() createProductRequestDto: CreateProductRequestDto,
  ): Promise<ProductAdminDto> {
    this.logger.log(JSON.stringify(createProductRequestDto, null, 2));
    const res = await this.productService.createProduct(
      createProductRequestDto,
    );

    return mapProductDocumentToProductAdminDto(res);
  }

  @Post('update/:id')
  async postUpdate(
    @Body() updateData: ProductAdminDto,
    @Param('id') id: string,
  ): Promise<ProductAdminDto> {
    const res = await this.productService.updateProduct(id, updateData);
    if (!res) {
      throw new Error(`Product not found with id ${id}`);
    }
    return mapProductDocumentToProductAdminDto(res);
  }

  @Get('get/:id')
  async getProduct(@Param('id') id: string): Promise<ProductAdminDto> {
    const res = await this.productService.getProduct(id);
    if (!res) {
      throw new Error(`Product not found with id ${id}`);
    }
    return mapProductDocumentToProductAdminDto(res);
  }

  @Post('delete/:id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productService.deleteProduct(id);
  }

  @Get('list')
  async list(
    @Query('attrs') attrs: { key: string; values: string[] }[],
  ): Promise<ProductListResponseDto> {
    console.log('Attrs:', attrs);
    const query: any = {};
    if (attrs) {
      attrs.forEach(({ key, values }) => {
        query[`attrs.${key}`] = { $in: values };
      });
    }
    return await this.productService.find(query, LanguageEnum.UA);
  }

  @Get('attribute/list')
  async getAttributes(): Promise<AttributeDto[]> {
    const res = await this.productService.getAttributes();
    return res.map((attr) =>
      mapAttributeDocumentToAttributeDTO(attr, LanguageEnum.UA),
    );
  }
}
