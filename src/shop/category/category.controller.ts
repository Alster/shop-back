import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoriesNodeDto } from '../../../shopshared/dto/categories-tree.dto';
import {
  mapCategoriesNodeDTOToCategoryNode,
  mapCategoriesTreeDocumentToCategoriesTreeDTO,
} from '../mapper/map.categoriesTreeDocument-to-categoriesTreeDTO';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private logger: Logger = new Logger(CategoryController.name);

  @Get('tree')
  async getCategoriesTrees(): Promise<CategoriesNodeDto[]> {
    const categoriesTree = await this.categoryService.getCategoriesTree();
    return mapCategoriesTreeDocumentToCategoriesTreeDTO(categoriesTree).root;
  }

  @Post('tree')
  async saveCategoriesTrees(
    @Body() categoriesNodes: CategoriesNodeDto[],
  ): Promise<void> {
    const nodes = categoriesNodes.map(mapCategoriesNodeDTOToCategoryNode);
    await this.categoryService.saveCategoriesTree(nodes);
  }
}
