import { forwardRef, Module } from '@nestjs/common';
import { Routes, RouterModule } from '@nestjs/core';
import AuthModule from './auth/auth.module';
import UsersModule from './users/users.module';
import AdminPanelModule from './admin/admin-panel.module';
import { TeamsModule } from './admin/teams/teams.module';
import AdminModule from './admin/admin.module';
import { MembersModule } from './admin/members/members.module';
import { TechStackGroupModule } from './admin/techStackGroup/techStackGroup.module';
import { TechStacksModule } from './admin/tech-stacks/tech-stacks.module';
import { NewsModule } from './admin/news/news.module';
import { FoldersModule } from './folders/folders.module';
import { PhotosModule } from './photos/photos.module';
import { CommentsModule } from './comments/comments.module';
import { ProjectsModule } from './admin/projects/projects.module';
import { ClientsModule } from './admin/clients/clients.module';
import { AboutUsModule } from './about-us/about-us.module';
import { HomeConfigModule } from './home-config/home-config.module';
import { HomeConfig } from './home-config/schemas/home-config.schema';
import { PermissionsModule } from './admin/permissions/permissions.module';
import { PublicModule } from './public/public.module';

const routes: Routes = [
  {
    path: '/v1',
    children: [
      { path: '/auth', module: AuthModule },
      { path: '/users', module: UsersModule },
      { path: '/admin', module: AdminModule },
      { path: '/teams', module: TeamsModule },
      { path: '/members', module: MembersModule },
      { path: '/folders', module: FoldersModule },
      { path: '/photos', module: PhotosModule },
      { path: '/projects', module: ProjectsModule },
      { path: '/clients', module: ClientsModule },
      { path: '/about-us', module: AboutUsModule },
      { path: '/admin/home-config', module: HomeConfigModule },
      { path: '/admin/tech-stack-group', module: TechStackGroupModule },
      { path: '/admin/tech-stack', module: TechStacksModule },
      { path: '/admin/news', module: NewsModule },
      { path: '/admin/permissons', module: PermissionsModule },
      { path: '/public', module: PublicModule },
    ],
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
    PublicModule,
    AuthModule,
    UsersModule,
    TeamsModule,
    forwardRef(() => MembersModule),
    FoldersModule,
    TechStackGroupModule,
    TechStacksModule,
    AdminPanelModule,
    NewsModule,
    PhotosModule,
    CommentsModule,
    ProjectsModule,
    ClientsModule,
    forwardRef(() => AboutUsModule),
    HomeConfig,
    PermissionsModule,
  ],
})
export default class V1Module {}
