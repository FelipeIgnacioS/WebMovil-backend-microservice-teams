import { IsInt } from 'class-validator';

export class AssignMemberDto  {
  @IsInt()
  user_id: number;

  @IsInt()
  team_id: number;

  @IsInt()
  role_id: number;
}
