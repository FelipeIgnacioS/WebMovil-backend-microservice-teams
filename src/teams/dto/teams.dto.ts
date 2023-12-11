// team.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNumber()
  readonly createdByUserId: number;
}

export class UpdateTeamDto {

  @IsNumber()
  readonly idUser: number;

  @IsNumber()
  readonly idTeam: number;

  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

export class DeleteTeamDto {
  @IsNumber()
  readonly idTeam: number;

  @IsNumber()
  readonly idUser: number;
}

