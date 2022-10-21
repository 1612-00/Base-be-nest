import { Model } from 'mongoose';

import AdminJS from 'adminjs';
import { AdminModule as AdminPanel } from '@adminjs/nestjs';
import AdminJSMongoose from '@adminjs/mongoose';

import { getModelToken } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import UsersModule from '@v1/users/users.module';
import { User } from '@v1/users/schemas/users.schema';
import { MembersModule } from './members/members.module';
import { NewsModule } from './news/news.module';
import { ProjectsModule } from './projects/projects.module';
import { ClientsModule } from './clients/clients.module';
import { DefineRouteModule } from './define-route/define-route.module';

import AdminService from '@v1/admin/admin.service';
import AdminModule from '@v1/admin/admin.module';
import userResource from '@v1/admin/resources/user.resource';
import { PermissionsModule } from './permissions/permissions.module';

AdminJS.registerAdapter(AdminJSMongoose);

@Module({
  imports: [
    AdminPanel.createAdminAsync({
      imports: [UsersModule, AdminModule],
      inject: [ConfigService, AdminService, getModelToken('User')],
      useFactory: (
        cfg: ConfigService,
        adminService: AdminService,
        userModel: Model<User>,
      ) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [userResource(userModel)],
        },
        auth: {
          authenticate: adminService.authAdmin.bind(adminService),
          cookieName: cfg.get('ADMIN_COOKIE_NAME') as string,
          cookiePassword: cfg.get('ADMIN_COOKIE_PASSWORD') as string,
        },
      }),
    }),
    UsersModule,
    AdminModule,
    MembersModule,
    NewsModule,
    ProjectsModule,
    ClientsModule,
    PermissionsModule,
    DefineRouteModule,
  ],
})
export default class AdminPanelModule {}
