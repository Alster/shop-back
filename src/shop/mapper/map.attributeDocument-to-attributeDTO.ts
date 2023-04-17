import { AttributeDto } from '@shop/shared/dto/attribute.dto';
import { ItemAttributeDocument } from '../schema/item-attribute.schema';
import { getTranslation } from '../../helpers/translation-helpers';

export function mapAttributeDocumentToAttributeDTO(
  obj: ItemAttributeDocument,
  lang: string,
): AttributeDto {
  return {
    id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    key: obj.key,
    type: obj.type,
    values: obj.values.map((value) => {
      return {
        key: value.key,
        title: getTranslation(value.title, lang),
      };
    }),
    active: obj.active,
    createDate: 'no any date ololo',
  };
}
