import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, DeleteTaskDto, GetTasksDto } from './dto';

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
}
