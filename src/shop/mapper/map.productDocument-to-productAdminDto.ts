import { ProductAdminDto, ProductDto } from '@shop/shared/dto/product.dto';
import { ProductDocument } from '../schema/product.schema';

export function mapProductDocumentToProductAdminDto(
  obj: ProductDocument,
): ProductAdminDto {
  return {
    id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    categories: obj.categories.map((category) => category.toString()),
    characteristics: obj.characteristics,
    items: obj.items,
    attrs: obj.attrs,
    quantity: obj.quantity,
    price: obj.price,
    discount: obj.discount,
    currency: obj.currency,
    active: obj.active,
    createDate: 'no any date ololo',
  };
}
