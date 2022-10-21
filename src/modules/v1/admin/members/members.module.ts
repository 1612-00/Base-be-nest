import { UploadFileModule } from 'src/shared/uploadServices/uploadFiles.module';
import { forwardRef, Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MembersRepository } from './members.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from './schemas/members.schema';
import { TeamsModule } from '../teams/teams.module';
import { AboutUsModule } from '../../about-us/about-us.module';
import { PhotosModule } from '../../photos/photos.module';
import { FoldersModule } from '../../folders/folders.module';

@Module({
  providers: [MembersService, MembersRepository],
  controllers: [MembersController],
  imports: [
    forwardRef(() => AboutUsModule),
    TeamsModule,
    PhotosModule,
    FoldersModule,
    UploadFileModule,
    MongooseModule.forFeature([
      {
        name: Member.name,
        schema: MemberSchema,
      },
    ]),
  ],
  exports: [MembersService, MembersRepository],
})
export class MembersModule {}
