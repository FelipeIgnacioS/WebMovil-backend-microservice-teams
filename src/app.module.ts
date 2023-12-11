import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamsModule } from './teams/Team.module';
import { Team } from './infrastructure/team.entity';
import { Role } from './infrastructure/role.entity';
import { TeamMember } from './infrastructure//team-member.entity';
import { ProjectTeam } from './infrastructure/project-team.entity';
import { Project } from './infrastructure/project.entity';
import { TeamInvitation } from './infrastructure/team-invitation.entity';
import { ProjectTeamInvitation } from './infrastructure/proyect-team-invitation.entity';
import * as dotenv from 'dotenv';
import { TaskModule } from './tasks/task.module';
import { ProyectModule } from './proyects/proyect.module';
import { Task } from './infrastructure/task.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // tipo de base de datos
      host: process.env.TYPEORM_HOST, // host de la base de datos
      port: +process.env.TYPEORM_PORT, // puerto
      username: process.env.TYPEORM_USERNAME, // usuario
      password: process.env.TYPEORM_PASSWORD, // contraseña
      database: process.env.TYPEORM_DATABASE, // nombre de la base de datos
      entities: [Team, Role, TeamMember, Project, ProjectTeam, TeamInvitation, ProjectTeamInvitation, Task], // entidades que se usarán
      synchronize: true,
      logging: true,
    }),
    TeamsModule,
    TaskModule,
    ProyectModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}