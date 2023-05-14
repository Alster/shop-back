import { CategoryDto } from '@alster/shop-shared/dto/category.dto';
import { Category } from '../../../shop_shared_server/schema/category.schema';
import { LanguageEnum } from '@alster/shop-shared/constants/localization';

export function mapCategoryToCategoryDto(
  obj: Category,
  language: LanguageEnum,
): CategoryDto {
  return {
    id: obj._id.toString(),
    title: obj.title[language],
    description: obj.title[language],
    children: obj.children.map((id) => id.toString()),
    parents: obj.parents.map((id) => id.toString()),
    sort: obj.sort,
  };
}
