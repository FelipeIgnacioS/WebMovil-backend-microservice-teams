import { Controller, Post, Get, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { TeamInvitationsService } from '../services/invitation.service';
import { CreateTeamInvitationDto } from '../dto/invitations';

@Controller('team-invitations')
export class TeamInvitationsController {
  constructor(private readonly teamInvitationsService: TeamInvitationsService) {}

  @Post("create-invitation")
  async create(@Body() createTeamInvitationDto: CreateTeamInvitationDto) {
    await this.teamInvitationsService.createInvitation(createTeamInvitationDto);
    return { message: 'Invitación creada' };
  }

  @Get("get-invitations")
  async findAll(@Query('id') userId: number) {
    console.log("id:", userId);
    return this.teamInvitationsService.findAll(userId);
  }

  @Patch(':id/accept')
  async accept(@Param('id') id: number) {
    await this.teamInvitationsService.acceptInvitation(id);
    return { message: 'Invitación aceptada' };
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: number) {
    await this.teamInvitationsService.rejectInvitation(id);
    return { message: 'Invitación rechazada' };
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: number) {
    await this.teamInvitationsService.cancelInvitation(id);
    return { message: 'Invitación cancelada' };
  }

}
