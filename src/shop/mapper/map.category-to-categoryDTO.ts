import { CategoryDto } from '../../../shopshared/dto/category.dto';
import { Category } from '../schema/category.schema';
import { LanguageEnum } from '../../../shopshared/constants/localization';

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
