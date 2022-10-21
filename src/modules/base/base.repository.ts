import { IRepository } from './interfaceRepo/IRepository';
import { Document, FilterQuery, Types } from 'mongoose';
import mongoose from 'mongoose';
import { IListParams, resultPaging } from './Pagination/IPaginate';
import { SortQueries } from './Pagination/Paginate.const';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
export class Repository<T extends Document> implements IRepository<T> {
  constructor(private _repository: SoftDeleteModel<T>) {}

  async get(paginateParam?: IListParams): Promise<resultPaging> {
    try {
      let { conditions, projections, paginate, options } = paginateParam!;
      let { orderBy, sortBy } = paginate;
      let pageSize = Number(paginate.pageSize);
      let page = Number(paginate.page);
      pageSize = pageSize ? <number>pageSize : 50;
      sortBy = sortBy ? sortBy.trim() : 'createdAt';
      const sortOptions: any = {};
      sortOptions[`${sortBy}`] =
        orderBy === 'desc'
          ? SortQueries.DESC
          : sortBy == 'publishedDate' || sortBy == 'createdAt'
          ? SortQueries.DESC
          : SortQueries.ASC;
      orderBy = orderBy ? orderBy : '';
      // content = content ? content : '';
      conditions = conditions ? conditions : null;
      page = page ? page : 1;
      let numberOfDocuments = await this._repository.find(conditions).count();
      page < 1 ? 1 : page;
      page > numberOfDocuments ? numberOfDocuments : page;
      pageSize < 1 ? 50 : pageSize;
      let lastPage = Math.ceil(numberOfDocuments / pageSize);
      let nextPage = page + 1 > lastPage ? lastPage : page + 1;
      let prevPage = page - 1 < 1 ? 1 : page - 1;
      let skipDocument: number = (Number(page) - 1) * Number(pageSize);
      let items = await this._repository.find({ ...conditions }, null, {
        skip: skipDocument,
        limit: pageSize,
        sort: sortOptions,
        ...options,
      });

      let result = {
        items: [...items],
        numberOfDocuments: numberOfDocuments,
        lastPage: lastPage,
        nextPage: nextPage,
        prevPage: prevPage,
        currentPage: page,
      };

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async store(item: T): Promise<T> {
    try {
      const result = await this._repository.create(<T>item);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(id: string | mongoose.Types.ObjectId, item: any): Promise<T> {
    try {
      await this._repository.updateOne({ _id: id, isDeleted: false }, item, {
        new: true,
      });
      return Promise.resolve(item);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateOptions(
    id: string | mongoose.Types.ObjectId,
    item: any,
    options?: mongoose.QueryOptions,
  ) {
    try {
      const updateItem = await this._repository
        .updateOne({ _id: id, isDeleted: false }, item, {
          ...options,
          new: true,
        })
        .exec();
      return updateItem;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateOptionsv2(
    id: string | mongoose.Types.ObjectId,
    item: mongoose.UpdateWithAggregationPipeline | mongoose.UpdateQuery<T>,
    options?: mongoose.QueryOptions,
  ) {
    try {
      const updateItem = await this._repository.findOneAndUpdate(
        { _id: id, isDeleted: false },
        item,
        {
          ...options,
          new: true,
        },
      );
      return updateItem;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async softDelete(id: string | Types.ObjectId) {
    return this._repository.softDelete({ _id: id });
  }

  async remove(id: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      const result = await this._repository.softDelete({
        _id: id,
        isDeleted: false,
      });
      console.log(result);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async removeAll(filter: { [key: string]: any } = {}) {
    return this._repository.deleteMany(filter as any);
  }

  async hardDelete(id: string | Types.ObjectId) {
    try {
      const result = await this._repository.findOneAndDelete({
        _id: id,
        isDeleted: false,
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getAll(): Promise<T[]> {
    try {
      let result = await this._repository.find({});
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async getById(id: string | mongoose.Types.ObjectId): Promise<any> {
    try {
      // const result = await this._repository.findById(id);
      const result = await this._repository.findOne({
        _id: id,
        isDeleted: false,
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findByCodition(condition: any): Promise<any> {
    try {
      let result = await this._repository.find(condition);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async restore(id: string | Types.ObjectId) {
    return this._repository.restore({ _id: id });
  }

  async existed(filter: FilterQuery<T>) {
    return this._repository.exists(filter);
  }
}
