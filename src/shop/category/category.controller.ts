import { Controller, Get, Logger } from '@nestjs/common';
import { CategoryService } from '../../../shop_shared_server/service/category/category.service';
import { mapCategoriesTreeDocumentToCategoriesTreeDTO } from '../../../shop_shared/mapper/map.categoriesTreeDocument-to-categoriesTreeDTO';
import { mapCategoryToCategoryDto } from '../../../shop_shared/mapper/map.category-to-categoryDTO';
import { CategoriesNodeDto } from '../../../shop_shared/dto/categories-tree.dto';
import { CategoryDto } from '../../../shop_shared/dto/category.dto';
import { LanguageEnum } from '../../../shop_shared/constants/localization';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private logger: Logger = new Logger(CategoryController.name);

  @Get('tree')
  async getCategoriesTrees(): Promise<CategoriesNodeDto[]> {
    const categoriesTree = await this.categoryService.getCategoriesTree();
    return mapCategoriesTreeDocumentToCategoriesTreeDTO(categoriesTree).root;
  }

  @Get('list')
  async getCategories(): Promise<CategoryDto[]> {
    const categories = await this.categoryService.getCategories();
    return categories.map((category) =>
      mapCategoryToCategoryDto(category, LanguageEnum.UA),
    );
  }
}
