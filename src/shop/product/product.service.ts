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
import { ProductDto } from '@shop/shared/dto/product.dto';

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
      title: createProductRequestDto.name,
      price: createProductRequestDto.price,
      items: createProductRequestDto.items,
      categories: [],
    });
    return product;
  }

  public async updateProduct(
    id: string,
    updateData: ProductDto,
  ): Promise<ProductDocument | null> {
    return await this.productModel.findByIdAndUpdate(id, updateData).exec();
  }

  public async getProduct(id: string): Promise<ProductDocument | null> {
    return await this.productModel.findById(id).exec();
  }

  public async deleteProduct(id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(id).exec();
  }

  public async find(query: any): Promise<ProductListResponseDto> {
    const getProducts = async () => this.productModel.find(query).exec();
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

    // this.logger.log(JSON.stringify(aggregatedAttributes, null, 2));
    return {
      products: products.map(mapProductDocumentToProductDto),
      total: products.length,
      filters: aggregatedAttributes,
    };
  }

  public async getAttributes(): Promise<ItemAttributeDocument[]> {
    return await this.itemAttributeModel.find().exec();
  }
}
