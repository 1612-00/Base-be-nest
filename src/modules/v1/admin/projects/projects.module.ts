import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadFileModule } from '../../../../shared/uploadServices/uploadFiles.module';
import { FoldersModule } from '../../folders/folders.module';
import { PhotosModule } from '../../photos/photos.module';
import { MembersModule } from '../members/members.module';
import { ProjectsController } from './projects.controller';
import { ProjectsRepository } from './projects.repository';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema } from './schemas/projects.schema';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
  imports: [
    PhotosModule,
    MembersModule,
    UploadFileModule,
    FoldersModule,

    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  exports: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}
