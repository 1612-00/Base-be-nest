import { ParseFile } from 'src/shared/uploadServices/uploadFiles.pipe';
import { ParseArrayFile } from './../../../../shared/uploadServices/uploadArrayFiles.pipe';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
  FileInterceptor,
  AnyFilesInterceptor,
} from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { News } from './schema/news.schema';
import { PaginateQuery } from 'src/modules/base/Pagination/paginate.dto';
import { NewsPagination } from '../../../../enums/news.pagination.enum';

@ApiTags('news')
@ApiBearerAuth()
@ApiExtraModels(News)
@Controller()
@UseInterceptors(WrapResponseInterceptor)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the news',
          example:
            'Công an làm việc với người tung tin thất thiệt về ngân hàng SCB',
        },

        publishedDate: {
          type: 'date',
          description: 'The news published date',
          example: '2021-01-30',
        },
        status: {
          type: 'boolean',
          description: 'status the news',
        },
        content: {
          type: 'string',
          description: 'Content html after encode of the news',
          example:
            '&lt;p&gt;Sáng ngày 9/10, trao đổi với PV &lt;em&gt;Dân trí&lt;/em&gt;, Đại tá Tô Anh Dũng, Giám đốc Công an tỉnh Hà Nam cho biết, Công an tỉnh Hà Nam đã phối hợp với Cục An ninh chính trị nội bộ, Cục An ninh kinh tế - Bộ Công an làm việc với ông Nguyễn Kiên Q. (40 tuổi), trú tại xã Phù Vân, thành phố Phủ Lý, tỉnh Hà Nam, về hành vi sử dụng tài khoản cá nhân trên mạng xã hội facebook đăng tải, bình luận thông tin thất thiệt, gây hoang mang dư luận, tạo tâm lý bất an về việc người dân đồng loạt rút tiền tại các ngân hàng.&lt;/p&gt;',
        },
        homeDisplay: {
          type: 'boolean',
          description: 'status the news',
        },
        mainImg: {
          type: 'string',
          format: 'binary',
        },
        img: {
          type: 'string',
          format: 'binary',
        },
        photoLits: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  @ApiConsumes('multipart/form-data')
  @Post()
  async create(
    @Body() createNews: CreateNewsDto,
    @UploadedFiles(ParseArrayFile) files: Array<Express.Multer.File>,
  ) {
    return await this.newsService.create(createNews, files);
    return {};
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @ApiParam({ name: 'sortBy', enum: NewsPagination, required: false })
  @Get('/paginate')
  findAllPaginate(@Query() paginate: PaginateQuery) {
    return this.newsService.findAllPaginate(paginate);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    let a = await this.newsService.findOne(id);
    return a;
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the news',
          example:
            'Công an làm việc với người tung tin thất thiệt về ngân hàng SCB',
        },

        publishedDate: {
          type: 'date',
          description: 'The news published date',
          example: '2021-01-30',
        },
        status: {
          type: 'boolean',
          description: 'status the news',
        },
        content: {
          type: 'string',
          description: 'Content html after encode of the news',
          example:
            '&lt;p&gt;Sáng ngày 9/10, trao đổi với PV &lt;em&gt;Dân trí&lt;/em&gt;, Đại tá Tô Anh Dũng, Giám đốc Công an tỉnh Hà Nam cho biết, Công an tỉnh Hà Nam đã phối hợp với Cục An ninh chính trị nội bộ, Cục An ninh kinh tế - Bộ Công an làm việc với ông Nguyễn Kiên Q. (40 tuổi), trú tại xã Phù Vân, thành phố Phủ Lý, tỉnh Hà Nam, về hành vi sử dụng tài khoản cá nhân trên mạng xã hội facebook đăng tải, bình luận thông tin thất thiệt, gây hoang mang dư luận, tạo tâm lý bất an về việc người dân đồng loạt rút tiền tại các ngân hàng.&lt;/p&gt;',
        },
        homeDisplay: {
          type: 'boolean',
          description: 'status the news',
        },
        mainImg: {
          type: 'string',
          format: 'binary',
        },
        img: {
          type: 'string',
          format: 'binary',
        },
        photoLits: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFiles(ParseArrayFile) files: Array<Express.Multer.File>,
  ) {
    return this.newsService.update(id, updateNewsDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
