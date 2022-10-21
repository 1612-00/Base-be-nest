import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './createPermission.dto';

export class UpdatePermissonDto extends PartialType(CreatePermissionDto) {}
