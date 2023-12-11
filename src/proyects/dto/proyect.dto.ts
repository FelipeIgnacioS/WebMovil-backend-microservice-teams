import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsInt()
  createdByUserId: number;
}

export class DeleteProjectDto {
  @IsNotEmpty()
  @IsInt()
  idProyect: number;

  @IsNotEmpty()
  @IsInt()
  idUser: number;
}

export class UpdateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsInt()
  createdByUserId: number;

  @IsNotEmpty()
  @IsInt()
  idProject: number;
}
