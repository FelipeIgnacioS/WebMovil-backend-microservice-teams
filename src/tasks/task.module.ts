import { Module } from '@nestjs/common';
import { TasksController } from './task.controller';
import { TasksService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/infrastructure/task.entity';
import { Project } from 'src/infrastructure/project.entity';
import { Comment } from 'src/infrastructure/commen.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Task, Project, Comment])],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TaskModule {}
