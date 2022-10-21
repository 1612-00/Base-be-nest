import { IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class BaseRequestDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  keyword?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  status?: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  perPage?: number;

  @ApiProperty({
    required: false,
    type: String,
    description: 'sort asc || desc',
    example: 'desc',
  })
  @IsOptional()
  sortDate?: string;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({
    type: Number,
    example: 2,
    description:
      'The only option available is `2`. The difference is version 2 will use `metadata` as pagination info',
  })
  @IsOptional()
  paginationVersion?: number;
}
