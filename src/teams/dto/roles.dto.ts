import { IsString, IsOptional } from 'class-validator';

export class CreateRoleDto {
  
  createdByUserId: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  team_id: number;
}


export class UpdateRoleDto {
    @IsString()
    @IsOptional()
    readonly name?: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  }


export class DeleteRoleDto {
  @IsString()
  readonly idRole: number;

  @IsString()
  readonly idTeam: number;
}