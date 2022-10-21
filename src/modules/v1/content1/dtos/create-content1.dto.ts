import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { MessageTemplate } from '../../../../constants/message.constants';
import { OBJECTID_REGEX } from '../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../constants/validate.constants';

export class CreateContent1Dto {
  @ApiProperty({ name: 'whoWeAreTitle', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly whoWeAreTitle: string = '';

  @ApiProperty({ name: 'whoWeAreSubtitle', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly whoWeAreSubtitle: string = '';

  @ApiProperty({ name: 'greenBoxTitle', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly greenBoxTitle: string = '';

  @ApiProperty({ name: 'greenBoxSubtitle', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly greenBoxSubtitle: string = '';

  @ApiProperty({ name: 'banner2', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  @Matches(OBJECTID_REGEX, {
    message: `Banner 2 ${ValidateMessage.OBJECTID_NOT_VALID}`,
  })
  readonly banner2: string = '';
}
