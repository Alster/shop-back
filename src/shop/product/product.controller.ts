import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ProductService } from '../../../shop_shared_server/service/product/product.service';
import { mapAttributeDocumentToAttributeDTO } from '../../../shop_shared_server/mapper/product/map.attributeDocument-to-attributeDTO';
import { ObjectId } from 'mongodb';
import { LanguageEnum } from '../../../shop_shared/constants/localization';
import { ProductAdminDto } from 'shop_shared/dto/product/product.dto';
import { AttributeDto } from '../../../shop_shared/dto/product/attribute.dto';
import { ProductListAdminResponseDto } from '../../../shop_shared/dto/product/product-list.admin.response.dto';
import { mapProductDocumentToProductAdminDto } from '../../../shop_shared_server/mapper/product/map.productDocument-to-productAdminDto';

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
  ): Promise<ProductListAdminResponseDto> {
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

    const res = await this.productService.find(
      query,
      sort,
      skip,
      limit,
      LanguageEnum.UA,
    );

    return {
      products: res.products.map((product) =>
        mapProductDocumentToProductAdminDto(product),
      ),
      total: res.total,
      filters: res.filters,
      categories: res.categories,
    };
  }

  @Get('attribute/list')
  async getAttributes(): Promise<AttributeDto[]> {
    const res = await this.productService.getAttributes();
    return res.map((attr) =>
      mapAttributeDocumentToAttributeDTO(attr, LanguageEnum.UA),
    );
  }
}
