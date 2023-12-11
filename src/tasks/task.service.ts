import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../infrastructure/task.entity';
import { CreateTaskDto, UpdateTaskDto, DeleteTaskDto, GetTasksDto } from './dto';
import { Project } from 'src/infrastructure/project.entity';
import { fetchUserId } from 'src/middleware/invitationTeam';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {

    //crear una tarea y guardarla
    const project = await this.projectRepository.findOne({
      where: { id: createTaskDto.projectId },
    });
    if (!project) {
        throw new NotFoundException('Project not found');
    }
    const task = new Task();
    task.name = createTaskDto.name;
    task.description = createTaskDto.description;
    task.createdByUserId = createTaskDto.createdByUserId;
    task.project = project;
    task.responsibleId = createTaskDto.responsibleId;
    task.status = TaskStatus.Todo;
    task.comments = '';
    await this.taskRepository.save(task);
  }

  async getTask(id: number): Promise<Task> {
    // obtener una tarea por su id
    const task = await this.taskRepository.findOne({
        where: { id: id },
    });
    if (!task) {
        throw new NotFoundException('Task not found');
    }
    return task;
  }

  async getTasks(query: GetTasksDto): Promise<Task[]> {
    const taskQueryBuilder = this.taskRepository.createQueryBuilder('task');
    const userId = query.userId;
    // Filtrar por nombre de tarea
    if (query.name) {
      taskQueryBuilder.andWhere('task.name LIKE :name', { name: `%${query.name}%` });
    }
  
    // Filtrar por responsable
    if (query.responsibleId) {
      taskQueryBuilder.andWhere('task.responsibleId = :responsibleId', { responsibleId: query.responsibleId });
    }
  
    // Filtrar por estado
    if (query.status) {
      taskQueryBuilder.andWhere('task.status = :status', { status: query.status });
    }
  
    // Filtrar por tareas propias
    if (query.myTasks) {
      taskQueryBuilder.andWhere('(task.createdByUserId = :userId OR task.responsibleId = :userId)', { userId });
    }
  
    taskQueryBuilder.andWhere('task.deletedAt IS NULL');
  
    return await taskQueryBuilder.getMany();
  }
  
  

  async updateTask(updateTaskDto: UpdateTaskDto) {
    // primero debemos verificar que lo intente actualizar el usuario que lo creó, o el responsable
    const task = await this.taskRepository.findOne({
        where: { id: updateTaskDto.idTask },
    });
    if (!task) {
        throw new NotFoundException('Task not found');
    }
    if (task.createdByUserId !== updateTaskDto.idUser && task.responsibleId !== updateTaskDto.idUser) {
        throw new NotFoundException('User not allowed to update this task');
    }
    task.name = updateTaskDto.name;
    task.description = updateTaskDto.description;
    task.responsibleId = updateTaskDto.responsibleId;
    task.status = updateTaskDto.status;
    task.comments = updateTaskDto.comments;
    await this.taskRepository.save(task);
  }

  async deleteTask(deleteTaskDto: DeleteTaskDto): Promise<void> {
    // primero verificamos que la tarea exista
    const task = await this.taskRepository.findOne({
        where: { id: deleteTaskDto.idTask },
    });
    if (!task) {
        throw new NotFoundException('Task not found');
    }
    //verificamos que sea el creador o el encargado
    if (task.createdByUserId !== deleteTaskDto.idUser && task.responsibleId !== deleteTaskDto.idUser) {
        throw new NotFoundException('User not allowed to delete this task');
    }
    //marcamos la tarea como eliminada
    task.deletedAt = new Date();
    await this.taskRepository.save(task);
  }

  async getTasksOfProject(projectId: number): Promise<Task[]> {
    //obtener las tareas de un proyecto
    //primero debemos verificar que el proyecto exista
    const project = await this.projectRepository.findOne({
        where: { id: projectId },
    });
    if (!project) {
        throw new NotFoundException('Project not found');
    }
    //obtenemos las tareas del proyecto
    const tasks = await this.taskRepository.find({
        where: { project: { id: projectId } },
    });
    if (tasks.length === 0) {
        throw new NotFoundException('The project does not have tasks');
    }
    return tasks;
  }
}
