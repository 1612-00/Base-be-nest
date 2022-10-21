import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { MessageTemplate } from '../../../../constants/message.constants';

export class CreateBlackBoxDto {
  @ApiProperty({ name: 'title', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly title: string = '';

  @ApiProperty({ name: 'content', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly content: string = '';

  @ApiProperty({ name: 'title2', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly title2: string = '';

  @ApiProperty({ name: 'content2', type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly content2: string = '';
}
