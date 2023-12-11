import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTeam } from 'src/infrastructure/project-team.entity';
import { Project } from 'src/infrastructure/project.entity';
import { ProjectTeamInvitation } from 'src/infrastructure/proyect-team-invitation.entity';
import { ProjectInvitationsController } from './controllers/prInvitation.controller';
import { ProjectsController } from './controllers/proyect.controller';
import { ProjectTeamController } from './controllers/prTeam.controller';
import { ProjectInvitationsService } from './services/prInvitation.service';
import { ProjectsService } from './services/proyect.service';
import { ProjectTeamService } from './services/prTeam.service';
import { Team } from 'src/infrastructure/team.entity';
import { Task } from 'src/infrastructure/task.entity';
import { TeamMember } from 'src/infrastructure/team-member.entity';



@Module({
    imports: [TypeOrmModule.forFeature([Project, ProjectTeam, ProjectTeamInvitation, Team, Task, TeamMember])],
    controllers: [ProjectInvitationsController, ProjectsController,ProjectTeamController],
    providers: [ProjectInvitationsService, ProjectsService, ProjectTeamService],
    exports: [ProjectInvitationsService, ProjectsService, ProjectTeamService],
})
export class ProyectModule {}