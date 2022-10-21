import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { MessageTemplate } from '../../../../../constants/message.constants';
import { OBJECTID_REGEX } from '../../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../../constants/validate.constants';
import { StatusType } from '../../../../../enums/statuses.enum';

export class UpdateClientDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly name: string | undefined;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  readonly photo: string | undefined;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  readonly order: number | undefined;

  @ApiPropertyOptional({ enum: StatusType })
  @IsOptional()
  @IsEnum(StatusType, { message: `Status type ${MessageTemplate.NOT_FOUND}` })
  readonly status: StatusType = StatusType.PUBLISHED;
}
