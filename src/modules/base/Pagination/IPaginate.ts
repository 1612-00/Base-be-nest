import { QueryOptions } from 'mongoose';
import { IPaginateParams } from './IPaginateParamsBase';

export interface IListParams {
  conditions?: any;
  projections?: any;
  paginate: IPaginateParams;
  options?: QueryOptions;
}

export interface resultPaging {
  items: any;
  numberOfDocuments: number;
  lastPage: number;
  nextPage: number;
  prevPage: number;
  currentPage: number;
}
