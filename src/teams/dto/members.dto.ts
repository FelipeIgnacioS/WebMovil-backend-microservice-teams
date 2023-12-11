import { IsNumber } from 'class-validator';

export class AddMemberDto {
  @IsNumber()
  teamId: number;

  @IsNumber()
  userId: number;

}

export class UpdateMemberDto {
  @IsNumber()
  readonly userId: number;

  @IsNumber()
  readonly teamId: number;

  @IsNumber()
  readonly newRoleName : string;

  @IsNumber()
  readonly requestingUserId: number;
}

export class DeleteMemberDto{
  @IsNumber()
  readonly idTeam: number;

  @IsNumber()
  readonly idUserProperity: number;

  @IsNumber()
  readonly idUser: number;
}

