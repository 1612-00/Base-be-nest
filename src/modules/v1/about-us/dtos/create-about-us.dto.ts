import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { MessageTemplate } from '../../../../constants/message.constants';
import { CreateOurStoryDto } from '../../our-story/dtos/create-our-story.dto';

export class CreateAboutUsDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  @Type(() => String)
  readonly content: string | undefined;

  @ApiProperty({ type: String, format: 'binary' })
  photo: string | undefined;
}
