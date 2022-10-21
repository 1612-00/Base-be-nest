import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotosModule } from '../photos/photos.module';
import { FolderRepository } from './folder.repository';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { Folder, FolderSchema } from './schemas/folders.schema';

@Module({
  controllers: [FoldersController],
  providers: [FoldersService, FolderRepository],
  imports: [

    MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }]),
  ],
  exports: [FoldersService, FolderRepository],
})
export class FoldersModule {}
