import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'aws-sdk/clients/acm';
import { IsNotEmpty, IsOptional, Matches, Validate } from 'class-validator';
import { MessageTemplate } from '../../../../constants/message.constants';
import { OBJECTID_REGEX } from '../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../constants/validate.constants';
import { StatusType } from '../../../../enums/statuses.enum';

export class UpdatePhotoDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly link: string = '';
}
