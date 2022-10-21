import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { MessageTemplate } from '../../../../constants/message.constants';
import { OBJECTID_REGEX } from '../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../constants/validate.constants';

export class CreateBoxDto {
  @ApiProperty({ name: 'photo', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  @Matches(OBJECTID_REGEX, {
    message: `Photo ${ValidateMessage.OBJECTID_NOT_VALID}`,
  })
  readonly photo: string | undefined;
  
  @ApiProperty({ name: 'video', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  @Matches(OBJECTID_REGEX, {
    message: `Video ${ValidateMessage.OBJECTID_NOT_VALID}`,
  })
  readonly video: string | undefined;

  @ApiProperty({ name: 'title', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly title: string = '';

  @ApiProperty({ name: 'content', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly content: string = '';
}
