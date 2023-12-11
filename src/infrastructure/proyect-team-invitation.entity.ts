import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Project } from './project.entity';
import { Team } from './team.entity';

export enum InvitationStatus {
  Pending = 'PENDING',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
}


@Entity('ProjectTeamInvitation')
export class ProjectTeamInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, project => project.teams)
  project: Project;

  @ManyToOne(() => Team, team => team.projects)
  team: Team;

  @Column(
    {
      type: 'enum',
      enum: InvitationStatus,
      default: InvitationStatus.Pending,
    },
  )
  status: InvitationStatus;

  @Column('timestamp')
  invitationDate: Date;
}
