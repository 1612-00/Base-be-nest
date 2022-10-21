import { ApiProperty } from '@nestjs/swagger';
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

export class CreateTechStackDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly name: string = '';

  @ApiProperty({ type: String, format: 'binary' })
  readonly photo: string | undefined;

  @ApiProperty({ type: Number })
  @IsInt({ message: `Order ${ValidateMessage.IS_NUMBER}` })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  @Type(() => Number)
  readonly order: number | undefined;

  @ApiProperty({ enum: StatusType })
  @IsEnum(StatusType, { message: 'Status does not exist' })
  @IsOptional()
  readonly status: StatusType = StatusType.PUBLISHED;

  @ApiProperty({ type: String })
  @Matches(OBJECTID_REGEX, {
    message: `Tech stack group ${ValidateMessage.OBJECTID_NOT_VALID}`,
  })
  readonly group: string | undefined;
}
