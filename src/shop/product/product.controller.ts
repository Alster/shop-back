import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ProductService } from '../../../shop_shared_server/service/product/product.service';
import { mapAttributeDocumentToAttributeDTO } from '../mapper/map.attributeDocument-to-attributeDTO';
import { mapProductDocumentToProductAdminDto } from '../mapper/map.productDocument-to-productAdminDto';
import { ObjectId } from 'mongodb';
import { ProductAdminDto } from '../../../shop_shared/dto/product.dto';
import { ProductListResponseDto } from '../../../shop_shared/dto/product-list.response.dto';
import { LanguageEnum } from '../../../shop_shared/constants/localization';
import { AttributeDto } from '../../../shop_shared/dto/attribute.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  private logger: Logger = new Logger(ProductController.name);

  @Get('get/:id')
  async getProduct(@Param('id') id: string): Promise<ProductAdminDto> {
    const res = await this.productService.getProduct(id);
    if (!res) {
      throw new Error(`Product not found with id ${id}`);
    }
    return mapProductDocumentToProductAdminDto(res);
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
