import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvitationStatus, TeamInvitation } from '../../infrastructure/team-invitation.entity';
import { AddMemberDto } from 'src/teams/dto/members.dto';
import { CreateTeamInvitationDto } from '../dto/invitations';
import { TeamsService } from '../services/team.service';
import { fetchUserId } from 'src/middleware/invitationTeam';
import { MembersService } from './member.service';
@Injectable()
export class TeamInvitationsService {
  constructor(
    @InjectRepository(TeamInvitation) private teamInvitationRepository: Repository<TeamInvitation>,
    private teamService: TeamsService,
    private memberService: MembersService
  ) {}

  async createInvitation(createTeamInvitationDto: CreateTeamInvitationDto): Promise<TeamInvitation> {
    let userId;

    // Verificar que el equipo existe
    const team = await this.teamService.findOne(createTeamInvitationDto.teamId);
    if (!team) {
        throw new NotFoundException('El equipo no existe.');
    }
    //verificamos que el usuario sea el dueño del equipo
    if (team.createdByUserId != createTeamInvitationDto.userId) {
        throw new NotFoundException('No eres el dueño del equipo.');
    }
    
    try {
        userId = await fetchUserId(createTeamInvitationDto.emailInvitedUser);
    } catch (error) {
        throw new Error('No se pudo obtener el ID del usuario');
    }
    //verificar que no exista una invitacion para ese id user y ese id team
    const invitationExists = await this.teamInvitationRepository.findOne({ where: { invitedUserId: userId, team: { id: createTeamInvitationDto.teamId } } });
    if (invitationExists) {
        throw new NotFoundException('Ya existe una invitación para este usuario.');
    }
    const invitation = this.teamInvitationRepository.create({
        team: { id: createTeamInvitationDto.teamId },
        invitedUserId: userId,
        status: InvitationStatus.Pending,
        invitationDate: new Date() 
    });
    return this.teamInvitationRepository.save(invitation);
}


  //obtener invitaciones
  async findAll(userId: number): Promise<TeamInvitation[]> {
    // Crear el QueryBuilder y obtener las invitaciones del userId, con status Pending y con el team asociado a la invitacion (para obtener el nombre del equipo) 
    const query = this.teamInvitationRepository
        .createQueryBuilder('invitation')
        .leftJoinAndSelect('invitation.team', 'team')
        .where('invitation.invitedUserId = :userId', { userId: userId })
        .andWhere('invitation.status = :status', { status: InvitationStatus.Pending });
    
    const invitations = await query.getMany();
    if (invitations.length === 0) {
        throw new NotFoundException('No se encontraron invitaciones');
    }
    return invitations;
}


  async acceptInvitation(id: number): Promise<void> {
    const invitation = await this.teamInvitationRepository.findOne({
        where: { id: id },
        relations: ['team'],
    });
    if (!invitation || invitation.status !== InvitationStatus.Pending) {
        throw new NotFoundException('Invitación no válida o ya procesada');
    }
    invitation.status = InvitationStatus.Accepted;
    await this.teamInvitationRepository.save(invitation);
    await this.memberService.addMember({userId: invitation.invitedUserId, teamId: invitation.team.id});
    
}
  

async rejectInvitation(id: number): Promise<void> {
  const invitation = await this.teamInvitationRepository.findOne({
      where: { id: id },
      relations: ['team'],
  });
  if (!invitation || invitation.status !== InvitationStatus.Pending) {
      throw new NotFoundException('Invitación no válida o ya procesada');
  }
  invitation.status = InvitationStatus.Rejected;
  await this.teamInvitationRepository.save(invitation);
}


async cancelInvitation(id: number): Promise<void> {
  const invitation = await this.teamInvitationRepository.findOne({
      where: { id: id },
      relations: ['team'],
  });
  if (!invitation || invitation.status !== InvitationStatus.Pending) {
      throw new NotFoundException('Invitación no válida o ya procesada');
  }
  invitation.status = InvitationStatus.Cancelled;
  await this.teamInvitationRepository.save(invitation);
 }

}
