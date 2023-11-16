// project-team.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Project } from './project.entity';
import { Team } from './team.entity';

@Entity('ProjectTeamInvitation')
export class ProjectTeamInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, project => project.teams)
  project: Project;

  @ManyToOne(() => Team, team => team.projects)
  team: Team;

  @Column({ length: 255, nullable: false })
  status: string;
}
