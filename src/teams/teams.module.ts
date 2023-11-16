import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from '../infrastructure/team.entity';
import { TeamMember } from '../infrastructure/team-member.entity';
import { Role } from 'src/infrastructure/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamMember, Role])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
