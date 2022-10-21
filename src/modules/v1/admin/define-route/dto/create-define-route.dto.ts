import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDefineRouteDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty({ message: 'Route const name cannot be empty' })
  readonly routeConstName: string = '';

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty({ message: 'Route url cannot be empty' })
  readonly routeURL: string = '';

  @ApiProperty({ type: String })
  @IsString({ message: 'Route title must be a string' })
  readonly routeTitle?: string = '';
}
