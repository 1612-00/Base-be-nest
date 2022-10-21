import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusType } from '../../../../../enums/statuses.enum';

export default class CreateTeamDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty({ message: 'Team name cannot be empty' })
  readonly name: string = '';

  @ApiProperty({ type: Number })
  @IsInt({ message: 'Team order must be a number' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Team order cannot be empty' })
  readonly order: number = 99;

  @ApiProperty({ enum: StatusType, default: StatusType.PUBLISHED })
  @IsEnum(StatusType, { message: 'Status does not exist' })
  @IsOptional()
  readonly status: StatusType = StatusType.PUBLISHED;
}
