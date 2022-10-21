import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Repository } from '../../../base/base.repository';
import { ClientDocument, Client } from './schemas/clients.schema';

@Injectable()
export class ClientsRepository extends Repository<ClientDocument> {
  constructor(
    @InjectModel(Client.name)
    private clientModel: SoftDeleteModel<ClientDocument>,
  ) {
    super(clientModel);
  }

  async getAllClients() {
    return this.clientModel
      .find({ isDeleted: false })
      .populate('photo', 'link');
  }

  async getClientById(id: string | Types.ObjectId) {
    return this.clientModel
      .findOne({ _id: id, isDeleted: false })
      .populate('photo', 'link');
  }

  async getClientByName(name: string) {
    return this.clientModel
      .findOne({ name: name, isDeleted: false })
      .populate('photo', 'link');
  }
}
