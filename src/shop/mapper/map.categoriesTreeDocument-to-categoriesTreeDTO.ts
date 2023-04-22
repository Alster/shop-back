import { ItemAttributeDocument } from '../schema/item-attribute.schema';
import { getTranslation } from '../../helpers/translation-helpers';
import { AttributeDto } from '../../../shopshared/dto/attribute.dto';
import {
  CategoriesTreeDocument,
  CategoryNode,
} from '../schema/categories-tree.schema';
import {
  CategoriesNodeDto,
  CategoriesTreeDto,
} from '../../../shopshared/dto/categories-tree.dto';

function mapCategoryNodeToCategoriesNodeDTO(
  obj: CategoryNode,
): CategoriesNodeDto {
  return {
    id: obj._id.toString(),
    title: obj.title,
    description: obj.title,
    children: obj.children.map((child) =>
      mapCategoryNodeToCategoriesNodeDTO(child),
    ),
    sort: obj.sort,
    active: obj.active,
  };
}

export function mapCategoriesTreeDocumentToCategoriesTreeDTO(
  obj: CategoriesTreeDocument,
): CategoriesTreeDto {
  return {
    root: obj.root.map(mapCategoryNodeToCategoriesNodeDTO),
  };
}
