import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from '../teams/entity/team.entity';
import { TeamMember } from '../team_members/entity/team_member.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: 'futbolitos', // Reemplaza esto con tu clave secreta
    signOptions: { expiresIn: '60m' },
  }),HttpModule,TypeOrmModule.forFeature([Team, TeamMember])],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
