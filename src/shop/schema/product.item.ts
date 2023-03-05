import { ObjectId } from 'mongodb';

export type ProductItem = { _id: ObjectId } & { [index: string]: string[] };
