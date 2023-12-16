import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, DeleteTaskDto, GetTasksDto, AddCommentDto } from './dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('/create-task')
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.createTask(createTaskDto);
    return { message: 'Tarea creada exitosamente' };
  }

  @Get('/:id')
  async getTask(@Param('id') id: number) {
    const task = await this.tasksService.getTask(id);
    return task;
  }

  @Get()
  async getTasks(@Query() query: GetTasksDto) {
    const tasks = await this.tasksService.getTasks(query);
    return tasks;
  }

  //obtener las tareas de un project
  @Get('get-tasks/:projectId')
  async getTasksOfProject(@Param('projectId') projectId: number) {
    const tasks = await this.tasksService.getTasksOfProject(projectId);
    return tasks;
  }

  @Patch('/update-task')
  async updateTask(@Body() updateTaskDto: UpdateTaskDto) {
    const updatedTask = await this.tasksService.updateTask(updateTaskDto);
    return { message: 'Tarea actualizada exitosamente', updatedTask };
  }

  @Delete('/delete')
  async deleteTask(@Body() deleteTaskDto: DeleteTaskDto) {
    await this.tasksService.deleteTask(deleteTaskDto);
    return { message: 'Tarea eliminada exitosamente' };
  }

  @Post('/createComment')
  async createComment(@Body() body: AddCommentDto) {
    const comment = await this.tasksService.createComment(body);
    return { message: 'Comentario creado exitosamente'};
  }

  @Get('/getComments/:taskId')
  async getComments(@Param('taskId') taskId: number) {
    const comments = await this.tasksService.getComments(taskId);
    return comments;
  }
}
