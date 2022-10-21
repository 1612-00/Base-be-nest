import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { MessageTemplate } from '../../../../constants/message.constants';
import { OBJECTID_REGEX } from '../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../constants/validate.constants';

export class CreateOurStoryDto {
  @ApiProperty({ type: String, format: 'binary' })
  photo: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  content: string = '';
}
