import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTeam } from '../../infrastructure/project-team.entity';
import { AssignTeamToProjectDto, GetProjectsOfTeamDto, GetTeamsOfProyectDto, RemoveTeamFromProjectDto } from '../dto/prTeamDto';
import { Project } from 'src/infrastructure/project.entity';
import { Team } from 'src/infrastructure/team.entity';
import { get } from 'http';
import { log } from 'console';

@Injectable()
export class ProjectTeamService {
  constructor(
    @InjectRepository(ProjectTeam)
    private readonly projectTeamRepository: Repository<ProjectTeam>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async assignTeamToProject(assignTeamToProjectDto: AssignTeamToProjectDto) {
    const projectTeam = new ProjectTeam();
    //buscamos el proyecto
    const project = await this.projectRepository.findOne({
        where: { id: assignTeamToProjectDto.idProject },
    });
    //buscamos el equipo
    const team = await this.teamRepository.findOne({
        where: { id: assignTeamToProjectDto.idTeam },
    });
    if (!project || !team) {
      throw new UnauthorizedException('Project or team not found');
    }
    //verificamos que no exista el equipo en el proyecto
    const projectTeamExists = await this.projectTeamRepository.find({
      where: {
          project: { id: assignTeamToProjectDto.idProject },
          team: { id: assignTeamToProjectDto.idTeam }
      }
  });  
    if (projectTeamExists.length !== 0) {
      throw new UnauthorizedException('Team already exists in project');
    }
    //asignamos el equipo al proyecto
    projectTeam.project = project;
    projectTeam.team = team;
    //guardamos los cambios
    await this.projectTeamRepository.save(projectTeam);

  }

  async getTeamsOfProject(getTeamsOfProjectDto: GetTeamsOfProyectDto) {
    console.log("getTeamsOfProjectDto", getTeamsOfProjectDto);
    //obtener los equipos de un proyecto
    //hacemos una query para obtener los equipos de un proyecto y tener la información del equipo
    //debemos usar la tabla de ProjectTeam, ya que es la que tiene la relación entre los proyectos y los equipos
    //buscamos el project para ver si existe primero
    const project = await this.projectRepository.findOne({
        where: { id: getTeamsOfProjectDto.idProject },
    });
    if (!project) {
      throw new UnauthorizedException('Project not found');
    }

    const id = getTeamsOfProjectDto.idProject;
    console.log("id", id);
    const teams = await this.teamRepository
      .createQueryBuilder('Team')
      .innerJoin('Team.projects', 'projectTeam')
      .where('projectTeam.projectId = :idProject', { idProject: id })
      .getMany();
    if (teams.length === 0) {
      throw new UnauthorizedException('El proyecto no tiene equipos');
    }
    console.log("teams", teams);
    return teams;
  }

  async getProjectsOfTeam(getProjectsOfTeamDto: GetProjectsOfTeamDto) {
    //obtener los proyectos de un equipo
    //hacemos una query para obtener los proyectos de un equipo y tener la información del equipo
    //debemos usar la tabla de ProjectTeam, ya que es la que tiene la relación entre los proyectos y los equipos
    //buscamos el team para ver si existe primero
    const team = await this.teamRepository.findOne({
        where: { id: getProjectsOfTeamDto.idTeam },
    });
    if (!team) {
      throw new UnauthorizedException('Equipo no encontrado');
    }

    const id = getProjectsOfTeamDto.idTeam;
    console.log("id", id);
    const projects = await this.projectRepository
      .createQueryBuilder('Project')
      .innerJoin('Project.teams', 'projectTeam')
      .where('projectTeam.teamId = :idTeam', { idTeam: id })
      .getMany();
    if (projects.length === 0) {
      throw new UnauthorizedException('El equipo no tiene proyectos');
    }
    console.log("projects", projects);
    return projects;
  }

  async removeTeamFromProject(removeTeamFromProjectDto: RemoveTeamFromProjectDto) {
    //eliminar un equipo de un proyecto
    //primero verificamos que el id es el propietario del proyecto
    const project = await this.projectRepository.findOne({
        where: { id: removeTeamFromProjectDto.idProject },
    });
    if (project.createdByUserId !== removeTeamFromProjectDto.idUser) {
      throw new UnauthorizedException('You are not the owner of this project');
    }
     // Eliminar la relación entre el proyecto y el equipo
     const deleteResult = await this.projectTeamRepository.delete({
      project: { id: removeTeamFromProjectDto.idProject },
      team: { id: removeTeamFromProjectDto.idTeam }
    });

    if (deleteResult.affected === 0) {
      throw new NotFoundException('The project team relationship does not exist.');
    }
  }

}
