import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CategoriesTree,
  CategoriesTreeDocument,
} from '../schema/categories-tree.schema';

@Injectable()
export class CategoryService {
  private logger: Logger = new Logger(CategoryService.name);

  constructor(
    @InjectModel(CategoriesTree.name)
    private productModel: Model<CategoriesTreeDocument>,
  ) {}

  public async getCategoriesTree(): Promise<CategoriesTreeDocument> {
    const result = await this.productModel.findOne().exec();
    if (!result) {
      throw new Error('Categories tree not found');
    }
    return result;
  }
}
