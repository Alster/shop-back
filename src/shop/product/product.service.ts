import { Injectable, Logger } from '@nestjs/common';
import { Product, ProductDocument } from '../schema/product.schema';
import { CreateProductRequestDto } from '../dto/create-product.request.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ItemAttribute,
  ItemAttributeDocument,
} from '../schema/item-attribute.schema';
import { mapProductDocumentToProductAdminDto } from '../mapper/map.productDocument-to-productAdminDto';
import { ProductAdminDto } from '../../../shopshared/dto/product.dto';
import { ProductListResponseDto } from '../../../shopshared/dto/product-list.response.dto';
import { ObjectId } from 'mongodb';
import { Category, CategoryDocument } from '../schema/category.schema';
import { LanguageEnum } from '../../../shopshared/constants/localization';

@Injectable()
export class ProductService {
  private logger: Logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ItemAttribute.name)
    private itemAttributeModel: Model<ItemAttributeDocument>,
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
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
    const categories = await this.categoryModel
      .find(
        {
          _id: { $in: updateData.categories.map((id) => new ObjectId(id)) },
        },
        { parents: true },
      )
      .exec();

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      return null;
    }
    product.title = updateData.title;
    product.description = updateData.description;
    product.categories = updateData.categories.map((id) => new ObjectId(id));
    product.categoriesAll = [
      ...new Set(categories.map((category) => category.parents).flat()),
    ];
    product.characteristics = updateData.characteristics;
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

  public async find(
    query: any,
    lang: LanguageEnum,
  ): Promise<ProductListResponseDto> {
    console.log('Query:', JSON.stringify(query, null, 2));
    const getProducts = async () =>
      this.productModel
        .find(query, {
          [`title.${lang}`]: 1,
          [`description.${lang}`]: 1,
          categories: 1,
          characteristics: 1,
          items: 1,
          attrs: 1,
          quantity: 1,
          price: 1,
          currency: 1,
          discount: 1,
          active: 1,
          createDate: 1,
        })
        .exec();
    const getAggregation = async () => {
      const [result] = await this.productModel.aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: null,
            attrs: { $mergeObjects: '$attrs' },
            categories: { $addToSet: `$categories` },
          },
        },
        {
          $project: {
            attrs: 1,
            categories: {
              $reduce: {
                input: '$categories',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
          },
        },
      ]);
      return result;
    };
    const [products, aggregatedResult] = await Promise.all([
      getProducts(),
      getAggregation(),
    ]);

    return {
      products: products.map((product) =>
        mapProductDocumentToProductAdminDto(product),
      ),
      total: products.length,
      filters: aggregatedResult.attrs,
      categories: aggregatedResult.categories,
    };
  }

  public async getAttributes(): Promise<ItemAttributeDocument[]> {
    return await this.itemAttributeModel.find().exec();
  }
}
