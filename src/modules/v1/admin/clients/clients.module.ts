import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadFileModule } from '../../../../shared/uploadServices/uploadFiles.module';
import { FoldersModule } from '../../folders/folders.module';
import { PhotosModule } from '../../photos/photos.module';
import { ClientsController } from './clients.controller';
import { ClientsRepository } from './clients.repository';
import { ClientsService } from './clients.service';
import { Client, ClientSchema } from './schemas/clients.schema';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, ClientsRepository],
  imports: [
    PhotosModule,
    UploadFileModule,
    FoldersModule,

    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  exports: [ClientsService, ClientsRepository],
})
export class ClientsModule {}
