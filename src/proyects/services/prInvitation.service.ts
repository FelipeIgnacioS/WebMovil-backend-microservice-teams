import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvitationStatus, ProjectTeamInvitation } from '../../infrastructure/proyect-team-invitation.entity';
import { CreateProjectInvitationDto, RespondInvitationDto } from '../dto/invitationPr.dto';
import { Project } from 'src/infrastructure/project.entity';
import { Team } from 'src/infrastructure/team.entity';
import { ProjectTeamService } from './prTeam.service';
import { ProjectTeam } from 'src/infrastructure/project-team.entity';

@Injectable()
export class ProjectInvitationsService {
  constructor(
    @InjectRepository(ProjectTeamInvitation)
    private readonly projectTeamInvitationRepository: Repository<ProjectTeamInvitation>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(ProjectTeam)
    private readonly projectTeamRepository: Repository<ProjectTeam>,
    private readonly projectTeamService: ProjectTeamService,
    
  ) {}

  async createInvitation(createDto: CreateProjectInvitationDto) {
    //primero verificamos que sea el dueño del proyecto
    const project = await this.projectRepository.findOne({
        where: { id: createDto.idProject },
        });
    console.log("Project", project);
    if (!project) {
        throw new UnauthorizedException('Project not found');
    }
    if (project.createdByUserId != createDto.idUser) {
        throw new UnauthorizedException('You are not the owner of the project');
    }
    //buscamos el equipo
    const team = await this.teamRepository.findOne({
        where: { code: createDto.codeTeam },
    });

    if (!team) {
        throw new UnauthorizedException('Team not found');
    }
    //verificamos que el equipo no este en el proyecto con la tabla de ProjectTeam
    const projectTeamExists = await this.projectTeamRepository.find({
        where: {
            project: { id: project.id },
            team: { id: team.id }
        }
    });
    
    if (projectTeamExists.length !== 0) {
        throw new UnauthorizedException('Team already exists in project');
    }

    //verificamos que no exista la invitacion
    const projectInvitationExists = await this.projectTeamInvitationRepository.find({
        where: {
            project: { id: project.id },
            team: { id: team.id }
        }
    });
    //SI LA INVITACION YA EXISTE, y tiene el status de 'REJECTED', cambiamos el status a 'PENDING'
    if (projectInvitationExists.length !== 0 && projectInvitationExists[0].status == InvitationStatus.Rejected) {
        projectInvitationExists[0].status = InvitationStatus.Pending;
        await this.projectTeamInvitationRepository.save(projectInvitationExists[0]);
        return;
    }
    if (projectInvitationExists.length !== 0) {
        throw new UnauthorizedException('Invitation already exists');
    }

    //creamos la invitacion
    const projectInvitation = new ProjectTeamInvitation();
    projectInvitation.project = project;
    projectInvitation.team = team;
    //asignamos la fecha de creacion ahora
    projectInvitation.invitationDate = new Date();
    //guardamos los cambios
    await this.projectTeamInvitationRepository.save(projectInvitation);
  }

  async respondInvitation(respondDto: RespondInvitationDto) {
    // buscamos la invitacion
    const projectInvitation = await this.projectTeamInvitationRepository.findOne({
        where: { id: respondDto.idInvitation },
        relations: ['project', 'team'],
    });
    if (!projectInvitation) {
        throw new UnauthorizedException('Invitation not found');
    }
    //buscamos el proyecto
    const project = await this.projectRepository.findOne({
        where: { id: projectInvitation.project.id },
    });

    if (!project) {
        throw new UnauthorizedException('Project not found');
    }
    //buscamos el equipo
    const team = await this.teamRepository.findOne({
        where: { id: projectInvitation.team.id },
    });
    //verificamos que el usuario que responda sea el dueño del equipo
    if (team.createdByUserId != respondDto.idUser) {
        throw new UnauthorizedException('You are not the owner of the team');
    }

    //verificamos que la respuesta sea valida
    if (respondDto.response == 'ACCEPTED') {
        //agregamos el equipo al proyecto
        await this.projectTeamService.assignTeamToProject({
            idProject: project.id,
            idTeam: team.id,
        });
        //actualizamos el status de la invitacion
        projectInvitation.status = InvitationStatus.Accepted;
        //guardamos los cambios
        await this.projectTeamInvitationRepository.save(projectInvitation);
    }
    else if (respondDto.response == 'REJECTED') {
        //actualizamos el status de la invitacion
        projectInvitation.status = InvitationStatus.Rejected;
        //guardamos los cambios
        await this.projectTeamInvitationRepository.save(projectInvitation);
    }
    else {
        throw new UnauthorizedException('Invalid response');
    }
    
  }

  async getInvitationsOfProject(projectId: number) {
    // obtenemos la invitaciones de un proyecto
    //hacemos una query para obtener las invitaciones de un proyecto y tener la informacion de los equipos
    //verificar que el proyecto exista
    const project = await this.projectRepository.findOne({
        where: { id: projectId },
    });
    if (!project) {
        throw new UnauthorizedException('Project not found');
    }

    const invitations = await this.projectTeamInvitationRepository
      .createQueryBuilder('projectTeamInvitation')
      .innerJoin('projectTeamInvitation.team', 'team')
      .where('projectTeamInvitation.project.id = :projectId', { projectId: projectId })
      .getMany();
    return invitations;
  }

  async getInvitationsOfTeam(teamCode: string) {
    // primero buscamos al equipo por el codigo
    const team = await this.teamRepository.findOne({
        where: { code: teamCode },
    });
    if (!team) {
        throw new UnauthorizedException('Team not found');
    }
    // obtenemos la invitaciones de un equipo
    //hacemos una query builder para obtener las invitaciones de un equipo y tener la informacion de los proyectos    
    const invitations = await this.projectTeamInvitationRepository
      .createQueryBuilder('projectTeamInvitation')
      .leftJoinAndSelect('projectTeamInvitation.project', 'project')
      .where('projectTeamInvitation.team.id = :teamId', { teamId: team.id })
      .andWhere('projectTeamInvitation.status = :status', { status: InvitationStatus.Pending })
      .getMany();


    if (invitations.length === 0) {
        throw new UnauthorizedException('No pending invitations found');
    }
    return invitations;
  }
}

