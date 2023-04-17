import { Injectable, Logger } from '@nestjs/common';
import { Product, ProductDocument } from '../schema/product.schema';
import { CreateProductRequestDto } from '../dto/create-product.request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ItemAttribute,
  ItemAttributeDocument,
} from '../schema/item-attribute.schema';
import { ProductListResponseDto } from '@shop/shared/dto/product-list.response.dto';
import { mapProductDocumentToProductDto } from '../mapper/map.productDocument-to-productDto';
import { ProductAdminDto, ProductDto } from '@shop/shared/dto/product.dto';

@Injectable()
export class ProductService {
  private logger: Logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ItemAttribute.name)
    private itemAttributeModel: Model<ItemAttributeDocument>,
  ) {}

  public async createProduct(
    createProductRequestDto: CreateProductRequestDto,
  ): Promise<ProductDocument> {
    const product = await this.productModel.create({
      title: { ua: createProductRequestDto.name },
      price: createProductRequestDto.price,
      items: createProductRequestDto.items,
      categories: [],
    });
    return product;
  }

  public async updateProduct(
    id: string,
    updateData: ProductAdminDto,
  ): Promise<ProductDocument | null> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      return null;
    }
    product.title = updateData.title;
    product.description = updateData.description;
    // product.categories = updateData.categories;
    product.items = updateData.items;
    product.price = updateData.price;
    product.currency = updateData.currency;
    product.discount = updateData.discount;
    product.active = updateData.active;
    await product.save();
    return product;
  }

  public async getProduct(id: string): Promise<ProductDocument | null> {
    return await this.productModel.findById(id).exec();
  }

  public async deleteProduct(id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(id).exec();
  }

  public async find(query: any): Promise<ProductListResponseDto> {
    const getProducts = async () =>
      this.productModel
        .find(query, {
          [`title.ua`]: 1,
          ['description.ua']: 1,
          categories: 1,
          items: 1,
          attrs: 1,
          quantity: 1,
          price: 1,
          active: 1,
          createDate: 1,
        })
        .exec();
    const getAggregatedAttributes = async () => {
      const [{ attrs }] = await this.productModel.aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: null,
            attrs: {
              $mergeObjects: '$attrs',
            },
          },
        },
      ]);
      return attrs;
    };
    const [products, aggregatedAttributes] = await Promise.all([
      getProducts(),
      getAggregatedAttributes(),
    ]);

    return {
      products: products.map((product) =>
        mapProductDocumentToProductDto(product, 'ua'),
      ),
      total: products.length,
      filters: aggregatedAttributes,
    };
  }

  public async getAttributes(): Promise<ItemAttributeDocument[]> {
    return await this.itemAttributeModel.find().exec();
  }
}
