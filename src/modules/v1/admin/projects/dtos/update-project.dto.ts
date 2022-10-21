import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Matches, Min } from 'class-validator';
import { OBJECTID_REGEX } from '../../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../../constants/validate.constants';

export class UpdateProjectDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly name: string | undefined;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  readonly photo: string | undefined;

  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'string',
    },
    required: false,
  })
  @IsOptional()
  readonly memberList: string[] | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly description: string | undefined;

  @ApiPropertyOptional({ type: Number })
  @Type(() => Number)
  @IsOptional()
  readonly order: number | undefined;
}
