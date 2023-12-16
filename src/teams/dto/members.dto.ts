import { IsNumber } from 'class-validator';

export class AddMemberDto {
  @IsNumber()
  teamId: number;

  @IsNumber()
  userId: number;

}

export class UpdateMemberDto {
  @IsNumber()
  readonly idUser: number;

  @IsNumber()
  readonly idTeam: number;

  @IsNumber()
  readonly newRoleName : string;

  @IsNumber()
  readonly userId: number;
}

export class DeleteMemberDto{
  @IsNumber()
  readonly idTeam: number;

  @IsNumber()
  readonly idUserProperity: number;

  @IsNumber()
  readonly idUser: number;
}

export class LeaveTeam{
  @IsNumber()
  readonly idTeam: number;

  @IsNumber()
  readonly idUser: number;
}
