import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IPaginateParams } from './IPaginateParamsBase';

export class PaginateQuery implements IPaginateParams {
  @ApiProperty()
  sortBy?: string | undefined;

  @ApiProperty({enum: ['asc', 'desc']})
  orderBy?: string | undefined;

  @ApiProperty()
  @Type(() => Number)
  page?: number | undefined;

  @ApiProperty()
  @Type(() => Number)
  pageSize?: number | undefined;

  // @ApiProperty()
  // content?: string | undefined;
}
