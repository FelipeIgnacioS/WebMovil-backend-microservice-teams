import { IsNotEmpty, IsOptional, IsInt, IsString, IsBoolean } from 'class-validator';
import { TaskStatus } from 'src/infrastructure/task.entity';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsInt()
    createdByUserId: number;

    @IsOptional()
    @IsInt()
    responsibleId?: number;

    @IsNotEmpty()
    @IsInt()
    projectId: number;
}

export class UpdateTaskDto {
    @IsNotEmpty()
    @IsInt()
    idTask: number; 

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    responsibleId?: number;

    @IsOptional()
    @IsString()
    status?: TaskStatus;

    @IsOptional()
    @IsString()
    comments?: string; 

    @IsInt()
    @IsNotEmpty()
    idUser: number;
}

export class DeleteTaskDto {
    @IsNotEmpty()
    @IsInt()
    idTask: number;

    @IsNotEmpty()
    @IsInt()
    idUser: number;
}


export class GetTasksDto {

    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsInt()
    responsibleId?: number;
  
    @IsOptional()
    @IsString()
    status?: TaskStatus;
  
    @IsOptional()
    @IsBoolean()
    myTasks?: boolean;

    @IsInt()
    @IsNotEmpty()
    projectId: number;
  }
  
export class AddCommentDto{
    @IsNotEmpty()
    @IsInt()
    idTask: number; 

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsInt()
    createdByUserId : number;
}