import { IsInt, IsNotEmpty, isInt } from "class-validator";

export class AssignTeamToProjectDto {
  @IsInt()
  @IsNotEmpty()
  idTeam: number;

  @IsInt()
  @IsNotEmpty()
  idProject: number;
}


export class GetTeamsOfProyectDto {
  @IsInt()
  @IsNotEmpty()
  idProject: number;
}

export class GetProjectsOfTeamDto {
  @IsInt()
  @IsNotEmpty()
  idTeam: number;
}

export class RemoveTeamFromProjectDto{
    @IsInt()
    @IsNotEmpty()
    idTeam: number;

    @IsInt()
    @IsNotEmpty()
    idProject: number;

    @IsInt()
    @IsNotEmpty()
    idUser: number;
}