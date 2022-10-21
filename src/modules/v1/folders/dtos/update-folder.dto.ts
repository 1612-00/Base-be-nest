import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { MessageTemplate } from '../../../../constants/message.constants';

export class UpdateFolderDto {
  @ApiProperty({ type: String })
  @IsOptional()
  readonly name: string = '';
}
