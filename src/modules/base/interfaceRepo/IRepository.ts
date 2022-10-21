import mongoose, { AnyObject, Document, ObjectId } from 'mongoose';
import { IListParams, resultPaging } from '../Pagination/IPaginate';

export interface IRepository<T extends Document> {
  store(item: T): Promise<T|AnyObject>;
  update(id: mongoose.Types.ObjectId, item: T): Promise<any>;
  remove(id: mongoose.Types.ObjectId): Promise<any>;
  getAll(): Promise<T[]>;
  get(paginateParma: IListParams): Promise<resultPaging>;
  getById(id: mongoose.Types.ObjectId): Promise<any>;
  findByCodition(condition: any): Promise<any | any[]>;
}
