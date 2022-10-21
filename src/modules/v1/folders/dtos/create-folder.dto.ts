import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { MessageTemplate } from '../../../../constants/message.constants';
import { OBJECTID_REGEX } from '../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../constants/validate.constants';

export class CreateFolderDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly name: string = '';

  @ApiProperty({ type: String })
  @IsOptional()
  @Matches(OBJECTID_REGEX, {
    message: `Parent ${ValidateMessage.OBJECTID_NOT_VALID}`,
  })
  readonly parentId: string | undefined;
}
