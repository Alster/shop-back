import { ProductDto } from '@shop/shared/dto/product.dto';
import { ProductDocument } from '../schema/product.schema';

export function mapProductDocumentToProductDto(
  obj: ProductDocument,
): ProductDto {
  return {
    id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    categories: obj.categories.map((category) => category.toString()),
    items: obj.items,
    attrs: obj.attrs,
    quantity: obj.quantity,
    price: obj.price,
    active: obj.active,
    createDate: 'no any date ololo',
  };
}
