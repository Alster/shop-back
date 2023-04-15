import { AttributeDto } from '@shop/shared/dto/attribute.dto';
import { ItemAttributeDocument } from '../schema/item-attribute.schema';

export function mapAttributeDocumentToAttributeDTO(
  obj: ItemAttributeDocument,
): AttributeDto {
  return {
    id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    key: obj.key,
    type: obj.type,
    values: obj.values,
    active: obj.active,
    createDate: 'no any date ololo',
  };
}
