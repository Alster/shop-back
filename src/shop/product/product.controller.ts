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
import { ProductAdminDto } from '@alster/shop-shared/dto/product.dto';
import { ProductListResponseDto } from '@alster/shop-shared/dto/product-list.response.dto';
import { AttributeDto } from '@alster/shop-shared/dto/attribute.dto';
import { LanguageEnum } from '@alster/shop-shared/constants/localization';
import { ObjectId } from 'mongodb';

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

  @Post('clone/:id')
  async postClone(@Param('id') id: string): Promise<ProductAdminDto> {
    const res = await this.productService.cloneProduct(id);
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
    @Query('categories') categories: string[],
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: number,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<ProductListResponseDto> {
    console.log('Attrs:', attrs);
    const query: any = {};
    if (attrs) {
      attrs.forEach(({ key, values }) => {
        query[`attrs.${key}`] = { $in: values };
      });
    }
    if (categories) {
      query.categoriesAll = { $in: categories.map((id) => new ObjectId(id)) };
    }
    if (search) {
      query.$text = {
        $search: search,
      };
    }

    const sort: any = {};
    if (sortField) {
      if (sortField === 'title') {
        sort[`${sortField}.${LanguageEnum.UA}`] = sortOrder;
      } else {
        sort[sortField] = sortOrder;
      }
    }

    return await this.productService.find(
      query,
      sort,
      skip,
      limit,
      LanguageEnum.UA,
    );
  }

  @Get('attribute/list')
  async getAttributes(): Promise<AttributeDto[]> {
    const res = await this.productService.getAttributes();
    return res.map((attr) =>
      mapAttributeDocumentToAttributeDTO(attr, LanguageEnum.UA),
    );
  }
}
