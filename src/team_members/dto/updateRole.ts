import { IsInt } from 'class-validator';

export class UpdateRoleDto {
    @IsInt()
    role_id: number;
  }