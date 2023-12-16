import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProjectTeamService } from '../services/prTeam.service'
import { AssignTeamToProjectDto, GetProjectsOfTeamDto, GetTeamsOfProyectDto, RemoveTeamFromProjectDto } from '../dto/prTeamDto';

@Controller('project-team')
export class ProjectTeamController {
  constructor(private readonly projectTeamService: ProjectTeamService) {}

  @Post('assign-team')
  async assignTeamToProject(@Body() assignTeamToProjectDto: AssignTeamToProjectDto) {
    await this.projectTeamService.assignTeamToProject(assignTeamToProjectDto);
    return { message: 'Team assigned to project' };
  }

  @Get('teams/:idProject')
  async getTeamsOfProject(@Param() getTeamsOfProjectDto: GetTeamsOfProyectDto) {
    console.log("getProjectsOfTeamDto:", getTeamsOfProjectDto);
    return await this.projectTeamService.getTeamsOfProject(getTeamsOfProjectDto);
  }

  @Get('projects/:idTeam')
  async getProjectsOfTeam(@Param() getProjectsOfTeamDto: GetProjectsOfTeamDto) {
    console.log("getProjectsOfTeamDto:", getProjectsOfTeamDto);
    return await this.projectTeamService.getProjectsOfTeam(getProjectsOfTeamDto);
  }

  @Delete('remove-team')
  async removeTeamFromProject(@Body() removeTeamFromProjectDto: RemoveTeamFromProjectDto) {
    await this.projectTeamService.removeTeamFromProject(removeTeamFromProjectDto);
    return { message: 'Team removed from project' };
  }

}
