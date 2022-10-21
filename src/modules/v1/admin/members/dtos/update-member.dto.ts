import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, Matches } from 'class-validator';
import { OBJECTID_REGEX } from '../../../../../constants/regex.constants';
import { ValidateMessage } from '../../../../../constants/validate.constants';
import { StatusType } from '../../../../../enums/statuses.enum';

export class UpdateMemberDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly name: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly position: string | undefined;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Matches(OBJECTID_REGEX, {
    message: `Team ${ValidateMessage.OBJECTID_NOT_VALID}`,
  })
  readonly team: string | undefined;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  readonly order: number | undefined;

  @ApiProperty({ enum: StatusType })
  @ApiPropertyOptional({ enum: StatusType })
  @IsEnum(StatusType, { message: 'Status must be enum' })
  @IsOptional()
  readonly status: StatusType | undefined;
}
