import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { MessageTemplate } from '../../../../constants/message.constants';

export class CreateSloganDto {
  @ApiProperty({ name: 'slogan', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly slogan: string = '';

  @ApiProperty({ name: 'subSlogan', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly subSlogan: string = '';
}
