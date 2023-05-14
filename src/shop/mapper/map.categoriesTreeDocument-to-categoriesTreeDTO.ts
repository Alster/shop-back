import {
  CategoriesTree,
  CategoriesTreeDocument,
  CategoryNode,
} from '../../../shop_shared_server/schema/categories-tree.schema';
import {
  CategoriesNodeDto,
  CategoriesTreeDto,
} from '@alster/shop-shared/dto/categories-tree.dto';
import { ObjectId } from 'mongodb';

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

export function mapCategoriesNodeDTOToCategoryNode(
  obj: CategoriesNodeDto,
): CategoryNode {
  return {
    _id: new ObjectId(obj.id),
    title: obj.title,
    description: obj.title,
    children: obj.children.map((child) =>
      mapCategoriesNodeDTOToCategoryNode(child),
    ),
    sort: obj.sort,
    active: obj.active,
  };
}

export function mapCategoriesTreeDTOToCategories(
  obj: CategoryNode[],
): CategoriesTree {
  return {
    root: obj,
  };
}
