import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class techStackGroupCreateDto {
  @ApiProperty({ example: 'NodeJS' })
  @IsString()
  @IsNotEmpty({ message: 'Name Tech Stack Group cannot be empty' })
  readonly name: string = '';

  @ApiProperty({ example: '0' })
  @IsNumber()
  @IsNotEmpty()
  readonly order: Number = 0;
}

export class techStackGroupUpdateDto {
  @ApiProperty({ example: 'NodeJS' })
  @IsString()
  @IsOptional()
  readonly name: string = '';

  @ApiProperty({ example: '0' })
  @IsNumber()
  @IsOptional()
  readonly order: Number = 0;
}
