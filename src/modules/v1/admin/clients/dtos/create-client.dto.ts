import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { MessageTemplate } from '../../../../../constants/message.constants';
import { OBJECTID_REGEX } from '../../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../../constants/validate.constants';
import { StatusType } from '../../../../../enums/statuses.enum';

export class CreateClientDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({ message: MessageTemplate.EMPTY })
  readonly name: string = '';

  @ApiProperty({ type: String, format: 'binary' })
  readonly photo: string | undefined;

  @ApiProperty({ type: Number })
  @IsNotEmpty({ message: `${MessageTemplate.EMPTY}: Order` })
  @Type(() => Number)
  readonly order: number = 100;

  @ApiProperty({ enum: StatusType })
  @IsOptional()
  @IsEnum(StatusType, { message: `Status type ${MessageTemplate.NOT_FOUND}` })
  readonly status: StatusType = StatusType.PUBLISHED;
}
