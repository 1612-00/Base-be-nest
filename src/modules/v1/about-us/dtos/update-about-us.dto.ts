import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateAboutUsDto {
  @ApiPropertyOptional({ type: String })
  @Type(() => String)
  readonly content: string | undefined;

  @ApiProperty({ type: String, format: 'binary' })
  photo: string | undefined;
}
