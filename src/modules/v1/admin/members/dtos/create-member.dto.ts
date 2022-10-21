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
import {
  OBJECTID_REGEX,
} from '../../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../../constants/validate.constants';
import { StatusType } from '../../../../../enums/statuses.enum';

export class CreateMemberDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly name: string | undefined;

  @ApiProperty({ type: String })
  readonly position: string = '';

  @ApiProperty({ type: String })
  @IsOptional()
  @Matches(OBJECTID_REGEX, {
    message: `Team ${ValidateMessage.OBJECTID_NOT_VALID}`,
  })
  readonly team: string | undefined;

  @ApiProperty({ type: String })
  readonly parentId: string | undefined;

  @ApiProperty({ type: Number })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  @Type(() => Number)
  @IsInt({ message: `Order ${ValidateMessage.IS_NUMBER}` })
  readonly order: number | undefined;

  @ApiProperty({ enum: StatusType })
  @IsEnum(StatusType, { message: 'Status must be enum' })
  @IsOptional()
  readonly status: StatusType = StatusType.PUBLISHED;
}
