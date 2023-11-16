import { IsNumber } from 'class-validator';

export class AddMemberDto {
  @IsNumber()
  readonly teamId: number;

  @IsNumber()
  readonly userId: number;

}

export class UpdateMemberDto {
  @IsNumber()
  readonly userId: number;

  @IsNumber()
  readonly teamId: number;

  @IsNumber()
  readonly roleId: number;
}
