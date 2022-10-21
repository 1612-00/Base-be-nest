import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MessageTemplate } from '../../../../../constants/message.constants';
import { ValidateMessage } from '../../../../../constants/validate.constants';
import { StatusType } from '../../../../../enums/statuses.enum';

export default class UpdateTeamDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsNotEmpty()
  readonly name: string | undefined;

  @ApiPropertyOptional({ type: Number })
  @IsInt({ message: `Order ${ValidateMessage.IS_NUMBER}` })
  @IsOptional()
  @Type(() => Number)
  readonly order: number | undefined;

  @ApiPropertyOptional({ enum: StatusType })
  @IsEnum(StatusType, { message: `Status ${MessageTemplate.NOT_FOUND}` })
  @IsOptional()
  readonly status: StatusType | undefined;
}
