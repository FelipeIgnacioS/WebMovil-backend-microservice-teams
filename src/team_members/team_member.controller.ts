import { Controller, Post, Delete, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TeamMembersService } from './team_member.service';
import { AssignMemberDto } from './dto/assign-member.dto';
import { UpdateRoleDto } from './dto/updateRole';
import { JwtValidationGuard } from '../middleware/jwt-validation.middleware';

@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  //funciona, falta definir roles
  @UseGuards(JwtValidationGuard)
  @Post('assign')
  assignMember(@Body() assignMemberDto: AssignMemberDto) {
    return this.teamMembersService.assignMember(assignMemberDto);
  }

  //funciona correctamente
  @UseGuards(JwtValidationGuard)
  @Delete('remove/:teamId/:userId')
  removeMember(@Param('teamId') teamId: number, @Param('userId') userId: number) {
    return this.teamMembersService.removeMember(teamId, userId);
  }

  
  @UseGuards(JwtValidationGuard)
  @Patch('update-role/:teamId/:userId')
  updateRole(@Param('teamId') teamId: number, @Param('userId') userId: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.teamMembersService.updateRole(teamId, userId, updateRoleDto);
  }
}
