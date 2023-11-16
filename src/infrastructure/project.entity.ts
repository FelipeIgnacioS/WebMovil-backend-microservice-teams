// project.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjectTeam } from './project-team.entity';

@Entity('Project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: false })
  createdByUserId: number;

  @OneToMany(() => ProjectTeam, projectTeam => projectTeam.project)
  teams: ProjectTeam[]; 
}
