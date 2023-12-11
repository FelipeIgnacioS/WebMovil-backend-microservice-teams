import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, Put, UnauthorizedException } from '@nestjs/common';
import { ProjectsService } from '../services/proyect.service';
import { CreateProjectDto, UpdateProjectDto, DeleteProjectDto } from '../dto/proyect.dto';
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create-project')
  async create(@Body() createProjectDto: CreateProjectDto) {
    await this.projectsService.create(createProjectDto);
    return { message: 'Proyecto creado con exito'};
  }

  //obtener un proyecto por id
  @Get('get-proyect/:id')
  async findOne(@Param('id') id: number) {
    return this.projectsService.findOne(id);
  }

  //obtener todos los proyectos de un usuario
  @Get('get-proyects/:userId')
  async findAll(@Param('userId') userId: number) {
    return this.projectsService.getUserProjects(userId);
  }

  //obtener los proyectos donde un usuario es dueño
  @Get('get-proyects-owner/:userId')
  async findAllOwner(@Param('userId') userId: number) {
    return this.projectsService.getUserProjectsOwner(userId);
  }

  //actualizar un proyecto
  @Patch('update-project')
  async update(@Body () updateProjectDto : UpdateProjectDto) {
    await this.projectsService.update(updateProjectDto);
    return { message: 'Proyecto actualizado con exito'};
  }

  //eliminar un equipo de un proyecto
  @Delete('delete-project')
  async deleteTeam(@Body () deleteProjectDto : DeleteProjectDto) {
    await this.projectsService.deleteProject(deleteProjectDto);
    return { message: 'Proyecto eliminado con exito'};
  }

  //obtener todos los usuarios de un proyecto
  @Get('get-users/:projectId')
  async getUsers(@Param('projectId') projectId: number) {
    return this.projectsService.getUsers(projectId);
  }

}