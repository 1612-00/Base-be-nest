import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty()
  title: string | undefined;

  @ApiProperty()
  constName: string | undefined;

  @ApiProperty()
  accessUrl: string[] | undefined;
}
