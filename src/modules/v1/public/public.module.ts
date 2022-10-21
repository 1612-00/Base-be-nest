import { Module } from '@nestjs/common';
import { AboutUsModule } from '@v1/about-us/about-us.module';
import { ClientsModule } from '@v1/admin/clients/clients.module';
import { MembersModule } from '@v1/admin/members/members.module';
import { NewsModule } from '@v1/admin/news/news.module';
import { ProjectsModule } from '@v1/admin/projects/projects.module';
import { TeamsModule } from '@v1/admin/teams/teams.module';
import { TechStacksModule } from '@v1/admin/tech-stacks/tech-stacks.module';
import { TechStackGroupModule } from '@v1/admin/techStackGroup/techStackGroup.module';
import { FoldersModule } from '@v1/folders/folders.module';
import { HomeConfigModule } from '@v1/home-config/home-config.module';
import { PhotosModule } from '@v1/photos/photos.module';
import { PublicAboutUsController } from './controllers/about-us/public-about-us.controller';
import { PublicClientsController } from './controllers/clients/public-clients.controller';
import { PublicFoldersController } from './controllers/folders/public-folders.controller';
import { PublicHomeConfigController } from './controllers/home-config/public-home-config.controller';
import { PublicMembersController } from './controllers/members/public-members.controller';
import { PublicNewsController } from './controllers/news/public-news.controller';
import { PublicPhotosController } from './controllers/photos/public-photos.controller';
import { PublicProjectsController } from './controllers/projects/public-projects.controller';
import { PublicTeamsController } from './controllers/teams/public-teams.controller';
import { PublicTechStackGroupController } from './controllers/tech-stack-group/public-tech-stack-group.controller';
import { PublicTechStackController } from './controllers/tech-stack/public-tech-stack.controller';
import { PublicService } from './public.service';

@Module({
  imports: [
    TeamsModule,
    MembersModule,
    AboutUsModule,
    PhotosModule,
    FoldersModule,
    TechStackGroupModule,
    TechStacksModule,
    NewsModule,
    HomeConfigModule,
    ProjectsModule,
    ClientsModule,
  ],
  controllers: [
    PublicTeamsController,
    PublicAboutUsController,
    PublicClientsController,
    PublicFoldersController,
    PublicHomeConfigController,
    PublicMembersController,
    PublicNewsController,
    PublicPhotosController,
    PublicProjectsController,
    PublicTechStackGroupController,
    PublicTechStackController,
  ],
  providers: [PublicService],
  exports: [PublicService],
})
export class PublicModule {}
