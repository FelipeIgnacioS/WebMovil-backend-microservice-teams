import { Module } from '@nestjs/common';
import { TasksController } from './task.controller';
import { TasksService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/infrastructure/task.entity';
import { Project } from 'src/infrastructure/project.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Task, Project])],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TaskModule {}
