import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { Comment } from './commen.entity';
export enum TaskStatus {
    Todo = 'Por Hacer',
    InProgress = 'En curso',
    Done = 'Realizada',
}

@Entity('Task')
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text', { nullable: false })
    description: string;

    @Column()
    createdByUserId: number;

    @Column({ nullable: true })
    responsibleId: number;

    @Column({ nullable: true })
    nameResponsible: string;

    @Column({ nullable: true })
    nameCreatedBy: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.Todo,
    })
    status: TaskStatus;

    @Column('timestamp', { nullable: true })
    startDate: Date;

    @Column('timestamp', { nullable: true })
    endDate: Date;

    @ManyToOne(() => Project)
    project: Project;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null;

    @Column({ nullable: true })
    comments: string;
    task: Task;

    @OneToMany(() => Comment, comment => comment.task)
    commentss: Comment[];
}
