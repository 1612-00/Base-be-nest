import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'aws-sdk/clients/acm';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  Validate,
} from 'class-validator';
import { MessageTemplate } from '../../../../constants/message.constants';
import { OBJECTID_REGEX } from '../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../constants/validate.constants';
import { StatusType } from '../../../../enums/statuses.enum';

export class CreatePhotoDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly link: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  @Matches(OBJECTID_REGEX, {
    message: `Folder ${ValidateMessage.OBJECTID_NOT_VALID}`,
  })
  readonly folder: string | undefined;

  @ApiProperty({ enum: StatusType })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  @IsEnum(StatusType, { message: `Status type ${MessageTemplate.NOT_FOUND}` })
  readonly status: StatusType = StatusType.PUBLISHED;
}
