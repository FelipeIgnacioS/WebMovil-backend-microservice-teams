import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { ProjectInvitationsService } from '../services/prInvitation.service';
import { CreateProjectInvitationDto, RespondInvitationDto } from '../dto/invitationPr.dto';

@Controller('project-invitations')
export class ProjectInvitationsController {
  constructor(private readonly projectInvitationsService: ProjectInvitationsService) {}

  @Post('/create-invitation')
  async createInvitation(@Body() createDto: CreateProjectInvitationDto) {
    await this.projectInvitationsService.createInvitation(createDto);
    return { message: 'Invitación creada con éxito' };
  }

  @Patch('/respond')
  async respondInvitation(@Body() respondDto: RespondInvitationDto) {
    await this.projectInvitationsService.respondInvitation(respondDto);
    return { message: 'Invitación respondida con éxito' };
  }

  @Get('/project/:projectId')
  async getInvitationsOfProject(@Param('projectId') projectId: number) {
    return await this.projectInvitationsService.getInvitationsOfProject(projectId);
  }

  @Get('/team/:teamCode')
  async getInvitationsOfTeam(@Param('teamCode') teamCode: string) {
    return await this.projectInvitationsService.getInvitationsOfTeam(teamCode);
  }
}
