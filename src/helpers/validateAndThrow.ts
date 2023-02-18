import { validate } from 'class-validator';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

export async function validateAndThrow(target: any) {
  const errors = await validate(target);
  if (errors.length > 0) {
    // console.info(errors.toString());
    // console.info(JSON.stringify(errors[0], null, 2));
    throw new Error(
      `${errors
        .map((e) => Object.values(e.constraints as any).join(', '))
        .join(', ')}`,
    );
  }
}

@EventSubscriber()
export class GlobalEntitySubscriber implements EntitySubscriberInterface<any> {
  async beforeInsert(event: InsertEvent<any>) {
    await validateAndThrow(event.entity);
  }
}
