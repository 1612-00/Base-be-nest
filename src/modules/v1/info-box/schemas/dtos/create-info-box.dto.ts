import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { MessageTemplate } from '../../../../../constants/message.constants';
import { CreateBoxDto } from '../../../box/dtos/create-box.dto';

export class CreateInfoBoxDto {
  @ApiProperty({ type: CreateBoxDto })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  @Type(() => CreateBoxDto)
  readonly box1: CreateBoxDto | undefined;

  @ApiProperty({ type: CreateBoxDto })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  @Type(() => CreateBoxDto)
  readonly box2: CreateBoxDto | undefined;
}
