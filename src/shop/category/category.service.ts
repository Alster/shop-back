import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CategoriesTree,
  CategoriesTreeDocument,
  CategoryNode,
} from '../schema/categories-tree.schema';

@Injectable()
export class CategoryService {
  private logger: Logger = new Logger(CategoryService.name);

  constructor(
    @InjectModel(CategoriesTree.name)
    private categoriesModel: Model<CategoriesTreeDocument>,
  ) {}

  public async getCategoriesTree(): Promise<CategoriesTreeDocument> {
    const result = await this.categoriesModel.findOne().exec();
    if (!result) {
      throw new Error('Categories tree not found');
    }
    return result;
  }

  public async saveCategoriesTree(
    categoriesTree: CategoryNode[],
  ): Promise<void> {
    const foundTree = await this.categoriesModel.findOne().exec();
    if (!foundTree) {
      throw new Error('Categories tree not found');
    }
    await this.categoriesModel
      .updateOne({ _id: foundTree._id }, { $set: { root: categoriesTree } })
      .exec();
  }
}
