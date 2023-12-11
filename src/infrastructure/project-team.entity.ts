import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { Team } from './team.entity';

@Entity('ProjectTeam')
export class ProjectTeam {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, project => project.teams)
  project: Project;

  @ManyToOne(() => Team, team => team.projects)
  team: Team;
    projectTeam: ProjectTeam;
}