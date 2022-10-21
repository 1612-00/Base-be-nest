import { ParseArrayFile } from './../../../shared/uploadServices/uploadArrayFiles.pipe';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiExtraModels,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import WrapResponseInterceptor from '../../../interceptors/wrap-response.interceptor';
import ParseObjectIdPipe from '../../../pipes/parse-object-id.pipe';
import { BlackBox } from '../black-box/schemas/black-box.schema';
import { Content1 } from '../content1/schemas/content1.schema';
import { InfoBox } from '../info-box/schemas/info-box.schema';
import { Slogan } from '../slogan/schemas/slogan.schema';
import { CreateHomeConfigDto } from './dtos/create-home-config.dto';
import { HomeConfigService } from './home-config.service';
import { HomeConfig } from './schemas/home-config.schema';
import { UpdateHomeConfigDto } from './dtos/update-home-config.dto';

@ApiTags('Home Config')
@ApiBearerAuth()
@ApiExtraModels(HomeConfig, Slogan, Content1, InfoBox, BlackBox)
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export class HomeConfigController {
  constructor(private readonly homeConfigService: HomeConfigService) {}

  @Get()
  async get() {
    return this.homeConfigService.get();
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'url home ',
          example: 'c5.vn/trang-chu',
        },
        logo: {
          type: 'string',
          format: 'binary',
        },
        logoMobile: {
          type: 'string',
          format: 'binary',
        },
        banner: {
          type: 'string',
          format: 'binary',
        },
        banner2Video: {
          type: 'string',
          format: 'binary',
        },
        banner2Photo: {
          type: 'string',
          format: 'binary',
        },
        slogan: {
          type: 'string',
          description: 'slogan C5',
          example: 'Fast - Innovative -',
        },
        subSlogan: {
          type: 'string',
          description: 'sub slogan C5',
          example: 'C5 Innovation Delivery Unit',
        },
        content1WhoWeAreTitle: {
          type: 'string',
          description: 'Description about c5',
          example: 'Who we are',
        },
        content1WhoWeAreSubTitle: {
          type: 'string',
          description: 'Description about c5',
          example:
            'Thành lập vào tháng 10 năm 2021 với 40 thành viên tài năng, sau 1 năm không nhừng nỗ lực, DU5 đã nâng quân số lên hơn 150 nhân sự chất lượng cao, đem đến sự hài lòng về chất lượng dịch vụ cho các khách hàng đến từ nhiều quốc gia trên thế giới như: Malaysia, Singapore, Hồng Kong, v.v..',
        },
        content1GreenBoxTitle: {
          type: 'string',
          description: 'sub slogan C5',
          example: 'SPOKEN NUMBERS',
        },
        content1GreenBoxSubTitle: {
          type: 'string',
          description: 'sub slogan C5',
          example:
            '2021 - 40 thành viên 2022 - 150 thành viên Hơn 50% thông thạo ngoại ngữ Hơn 10 dự án lớn nhỏ 3 mega accounts',
        },
        infoBox1Photo: {
          type: 'string',
          format: 'binary',
        },
        infoBox1Video: {
          type: 'string',
          format: 'binary',
        },
        infoBox1Title: {
          type: 'string',
          description: 'Description somethings',
          example: 'WORK TOGETHER, PLAY TOGETHER',
        },
        infoBox1Content: {
          type: 'string',
          description: 'Description somethings',
          example:
            'T together E everyone A achieves M more We set a common goal, work together to achieve it',
        },
        infoBox2Photo: {
          type: 'string',
          format: 'binary',
        },
        infoBox2Video: {
          type: 'string',
          format: 'binary',
        },
        infoBox2Title: {
          type: 'string',
          description: 'Description somethings',
          example: 'HARD WORKING - CREATIVE',
        },
        infoBox2Content: {
          type: 'string',
          description: 'Description somethings',
          example:
            'Choosing between creativity vs hard work isn’t a choice that DU5 members can make - that mean, if we really want to be successful. Creativity and hard work should be executed together to drive success.',
        },
        blackBoxTitle: {
          type: 'string',
          description: 'Description somethings',
          example: 'WHAT WE CAN DO',
        },
        blackBoxContent: {
          type: 'string',
          description: 'Description somethings',
          example:
            '⚙️ Software development ⚙️Quality Assurance ⚙️System Automation Testing ⚙️Realistic Solution Architecture ⚙️Professional Consulting',
        },
        blackBoxTitle2: {
          type: 'string',
          description: 'Description somethings',
          example: 'Our Memories, Our Lives',
        },
        blackBoxContent2: {
          type: 'string',
          description: 'Description somethings',
          example:
            'Tình cảm, nhiệt huyết của thời thanh xuân cũng sẽ phai nhạt dần theo thời gian nhưng những kỉ niệm dù vui hay buồn đều sẽ khắc ghi trong lòng mỗi người...',
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @Post()
  async add(
    @Body() createHomeConfigDto: CreateHomeConfigDto,
    @UploadedFiles(ParseArrayFile) files: Array<Express.Multer.File>,
  ) {
    return await this.homeConfigService.modify(createHomeConfigDto, files);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'url home ',
          example: 'c5.vn/trang-chu',
        },
        logo: {
          type: 'string',
          format: 'binary',
        },
        logoMobile: {
          type: 'string',
          format: 'binary',
        },
        banner: {
          type: 'string',
          format: 'binary',
        },
        banner2Video: {
          type: 'string',
          format: 'binary',
        },
        banner2Photo: {
          type: 'string',
          format: 'binary',
        },
        slogan: {
          type: 'string',
          description: 'slogan C5',
          example: 'Fast - Innovative -',
        },
        subSlogan: {
          type: 'string',
          description: 'sub slogan C5',
          example: 'C5 Innovation Delivery Unit',
        },
        content1WhoWeAreTitle: {
          type: 'string',
          description: 'Description about c5',
          example: 'Who we are',
        },
        content1WhoWeAreSubTitle: {
          type: 'string',
          description: 'Description about c5',
          example:
            'Thành lập vào tháng 10 năm 2021 với 40 thành viên tài năng, sau 1 năm không nhừng nỗ lực, DU5 đã nâng quân số lên hơn 150 nhân sự chất lượng cao, đem đến sự hài lòng về chất lượng dịch vụ cho các khách hàng đến từ nhiều quốc gia trên thế giới như: Malaysia, Singapore, Hồng Kong, v.v..',
        },
        content1GreenBoxTitle: {
          type: 'string',
          description: 'sub slogan C5',
          example: 'SPOKEN NUMBERS',
        },
        content1GreenBoxSubTitle: {
          type: 'string',
          description: 'sub slogan C5',
          example:
            '2021 - 40 thành viên 2022 - 150 thành viên Hơn 50% thông thạo ngoại ngữ Hơn 10 dự án lớn nhỏ 3 mega accounts',
        },
        infoBox1Photo: {
          type: 'string',
          format: 'binary',
        },
        infoBox1Video: {
          type: 'string',
          format: 'binary',
        },
        infoBox1Title: {
          type: 'string',
          description: 'Description somethings',
          example: 'WORK TOGETHER, PLAY TOGETHER',
        },
        infoBox1Content: {
          type: 'string',
          description: 'Description somethings',
          example:
            'T together E everyone A achieves M more We set a common goal, work together to achieve it',
        },
        infoBox2Photo: {
          type: 'string',
          format: 'binary',
        },
        infoBox2Video: {
          type: 'string',
          format: 'binary',
        },
        infoBox2Title: {
          type: 'string',
          description: 'Description somethings',
          example: 'HARD WORKING - CREATIVE',
        },
        infoBox2Content: {
          type: 'string',
          description: 'Description somethings',
          example:
            'Choosing between creativity vs hard work isn’t a choice that DU5 members can make - that mean, if we really want to be successful. Creativity and hard work should be executed together to drive success.',
        },
        blackBoxTitle: {
          type: 'string',
          description: 'Description somethings',
          example: 'WHAT WE CAN DO',
        },
        blackBoxContent: {
          type: 'string',
          description: 'Description somethings',
          example:
            '⚙️ Software development ⚙️Quality Assurance ⚙️System Automation Testing ⚙️Realistic Solution Architecture ⚙️Professional Consulting',
        },
        blackBoxTitle2: {
          type: 'string',
          description: 'Description somethings',
          example: 'Our Memories, Our Lives',
        },
        blackBoxContent2: {
          type: 'string',
          description: 'Description somethings',
          example:
            'Tình cảm, nhiệt huyết của thời thanh xuân cũng sẽ phai nhạt dần theo thời gian nhưng những kỉ niệm dù vui hay buồn đều sẽ khắc ghi trong lòng mỗi người...',
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @Patch('update')
  async update(
    @Body() updateHomeConfigDto: UpdateHomeConfigDto,
    @UploadedFiles(ParseArrayFile) files: Array<Express.Multer.File>,
  ) {
    return await this.homeConfigService.update(updateHomeConfigDto, files);
  }

  @Delete('delete')
  async delete() {
    return this.homeConfigService.delete();
  }

  @Post('restore/:id')
  @ApiParam({ name: 'id', type: String })
  async restore(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.homeConfigService.restore(id);
  }
}
