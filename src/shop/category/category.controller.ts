import { Controller, Get, Logger } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CategoriesNodeDto,
  CategoriesTreeDto,
} from '../../../shopshared/dto/categories-tree.dto';
import { mapCategoriesTreeDocumentToCategoriesTreeDTO } from '../mapper/map.categoriesTreeDocument-to-categoriesTreeDTO';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private logger: Logger = new Logger(CategoryController.name);

  @Get('tree')
  async getCategoriesTrees(): Promise<CategoriesNodeDto[]> {
    const categoriesTree = await this.categoryService.getCategoriesTree();
    return mapCategoriesTreeDocumentToCategoriesTreeDTO(categoriesTree).tree
      .children;
  }
}
