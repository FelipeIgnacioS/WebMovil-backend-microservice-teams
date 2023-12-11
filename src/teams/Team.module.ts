import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from '../teams/services/team.service';
import { TeamsController } from './controllers/team.controller';
import { Team } from '../infrastructure/team.entity';
import { TeamMember } from '../infrastructure/team-member.entity';
import { Role } from 'src/infrastructure/role.entity';
import { TeamInvitation } from 'src/infrastructure/team-invitation.entity';
import { TeamInvitationsController } from './controllers/invitation.controller';
import { MembersController } from './controllers/member.controller';
import { TeamInvitationsService } from './services/invitation.service';
import { MembersService } from './services/member.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamMember, Role, TeamInvitation])],
  controllers: [TeamsController,TeamInvitationsController,MembersController],
  providers: [TeamsService, TeamInvitationsService, MembersService],
  exports: [TeamsService, TeamInvitationsService, MembersService]
})
export class TeamsModule {}
