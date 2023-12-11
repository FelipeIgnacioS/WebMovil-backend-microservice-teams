import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../infrastructure/project.entity';
import { CreateProjectDto, UpdateProjectDto, DeleteProjectDto } from '../dto/proyect.dto';
import { ProjectTeam } from 'src/infrastructure/project-team.entity';
import { ProjectTeamInvitation } from 'src/infrastructure/proyect-team-invitation.entity';
import { Task } from 'src/infrastructure/task.entity';
import { fetchUserDetails } from 'src/middleware/member';
import { TeamMember } from 'src/infrastructure/team-member.entity';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectTeam)
    private readonly projectTeamRepository: Repository<ProjectTeam>,
    @InjectRepository(ProjectTeamInvitation)
    private readonly projectTeamInvitationRepository: Repository<ProjectTeamInvitation>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<void> {
    const code = await this.generateUniqueCode();
    const project = new Project();
    project.name = createProjectDto.name;
    project.description = createProjectDto.description;
    project.createdByUserId = createProjectDto.createdByUserId;
    project.code = code;
    await this.projectRepository.save(project);
  }

  async findOne(id: number): Promise<Project> {
    //buscar un proyecto por su id
    const project = await this.projectRepository.findOne({
        where: { id: id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async getUserProjects(userId: number): Promise<Project[]> {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .innerJoin('project.teams', 'projectTeam')
      .innerJoin('team_member', 'teamMember', 'projectTeam.teamId = teamMember.teamId')
      .where('teamMember.userId = :userId', { userId })
      .andWhere('project.deletedAt IS NULL') // Asegurar que el proyecto no está eliminado
      .getMany();
  
    if (!projects || projects.length === 0) {
      throw new NotFoundException('No projects found for this user');
    }
  
    return projects;
  }
  
  
  

  async getUserProjectsOwner(userId: number): Promise<Project[]> {
    const projects = await this.projectRepository.find({
        where: { createdByUserId: userId },
    });
    if (projects.length === 0) {
      throw new NotFoundException('El usuario no tieie ningun proyecto');
    }
    return projects;
  }

  async update(updateProjectDto: UpdateProjectDto) {
    //primero debemos buscar un proyecto por su id
    const project = await this.projectRepository.findOne({
        where: { id: updateProjectDto.idProject },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    //verificar si el usuario que esta intentando actualizar el proyecto es el dueño
    if (project.createdByUserId !== updateProjectDto.createdByUserId) {
      throw new UnauthorizedException('You are not the owner of this project');
    }
    //actualizar los datos del proyecto
    project.name = updateProjectDto.name;
    project.description = updateProjectDto.description;
    await this.projectRepository.save(project);
  }

  async deleteProject(deleteProjectDto: DeleteProjectDto): Promise<void> {
    //primero debemos buscar un proyecto por su id
    const project = await this.projectRepository.findOne({
        where: { id: deleteProjectDto.idProyect },
    });
    console.log("project", project);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    //verificar si el usuario que esta intentando eliminar el proyecto es el dueño
    if (project.createdByUserId !== deleteProjectDto.idUser) {
      throw new UnauthorizedException('You are not the owner of this project');
    }

    await this.projectTeamInvitationRepository.delete({ project: { id: project.id } });

    // Eliminar ProjectTeams relacionados
    await this.projectTeamRepository.delete({ project: { id: project.id } });

    // Eliminar Tasks relacionadas
    await this.taskRepository.delete({ project: { id: project.id } });

    // Eliminar el proyecto
    await this.projectRepository.remove(project);
  }

  async getUsers(projectId: number) {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
        throw new NotFoundException('Project not found');
    }

    const projectTeams = await this.projectTeamRepository
    .createQueryBuilder('projectTeam')
    .leftJoinAndSelect('projectTeam.team', 'team')
    .where('projectTeam.project.id = :projectId', { projectId })
    .getMany();

    const teamIds = projectTeams.map(pt => pt.team.id);
    console.log("teamIds", teamIds);

    const members = await this.teamMemberRepository
        .createQueryBuilder('team_member')
        .where('team_member.teamId IN (:...teamIds)', { teamIds })
        .getMany();

    const userIds = members.map(member => member.userId);


    // Eliminar duplicados de la lista userIds
    const ids = [...new Set(userIds)]
    
    try {
      const userDetails = await fetchUserDetails(ids);
  
      return userDetails
    } catch (error) {
      throw new Error('No se pudieron obtener los detalles de los usuarios');
    }
  }


  //otras funciones
  private async generateUniqueCode(): Promise<string> {
    const MAX_ATTEMPTS = 10;
    let attempts = 0;
    while (attempts < MAX_ATTEMPTS) {
      const code = this.createCode();
      const codeExist = await this.projectRepository.findOne({ where: { code: code } });
      if (!codeExist) {
        return code;
      }
      attempts++;
    }
    throw new Error('Unable to generate a unique team code.');
  }

  private createCode(): string {
    let code = '#';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

}
