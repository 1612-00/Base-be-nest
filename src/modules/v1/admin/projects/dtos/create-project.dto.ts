import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { MessageTemplate } from '../../../../../constants/message.constants';
import { OBJECTID_REGEX } from '../../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../../constants/validate.constants';
import { StatusType } from '../../../../../enums/statuses.enum';

export class CreateProjectDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: `${MessageTemplate.EMPTY}: name` })
  readonly name: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty({ message: `${MessageTemplate.EMPTY}: Description` })
  readonly description: string = '';

  @ApiProperty({ type: Number })
  @IsNotEmpty({ message: `${MessageTemplate.EMPTY}: Order` })
  @IsInt({ message: `Order ${ValidateMessage.IS_NUMBER}` })
  @Type(() => Number)
  readonly order: number = 100;

  @ApiProperty({ type: String, format: 'binary' })
  photo: string = '';

  @ApiProperty({
    type: [String],
  })
  memberList: string[] = [];

  @ApiProperty({ enum: StatusType })
  @IsOptional()
  @IsEnum(StatusType, { message: `Status type ${MessageTemplate.NOT_FOUND}` })
  readonly status: StatusType = StatusType.PUBLISHED;
}
