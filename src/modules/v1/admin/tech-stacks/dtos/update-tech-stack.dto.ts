import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { MessageTemplate } from '../../../../../constants/message.constants';
import { OBJECTID_REGEX } from '../../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../../constants/validate.constants';
import { StatusType } from '../../../../../enums/statuses.enum';

export class UpdateTechStackDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly name: string | undefined;

  @ApiPropertyOptional({ type: String, format: 'binary' })
  @IsOptional()
  readonly photo: string | undefined;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  readonly order: number | undefined;

  @ApiPropertyOptional({ enum: StatusType })
  @IsEnum(StatusType, {
    message: `Status ${MessageTemplate.NOT_FOUND}`,
  })
  @IsOptional()
  readonly status: StatusType = StatusType.PUBLISHED;

  @ApiPropertyOptional({ type: String })
  @Matches(OBJECTID_REGEX, {
    message: `Tech stack group ${ValidateMessage.OBJECTID_NOT_VALID}`,
  })
  @IsOptional()
  readonly group: string | undefined;
}
