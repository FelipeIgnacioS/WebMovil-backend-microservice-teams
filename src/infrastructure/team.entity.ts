import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TeamMember } from './team-member.entity';
import { Role } from './role.entity';
import { TeamInvitation } from './team-invitation.entity';
import { ProjectTeam } from './project-team.entity';  

@Entity('Team')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: false, name: 'creationdate' })
  creationDate: Date;

  @Column({ nullable: false, name: 'createdbyuserid' })
  createdByUserId: number;

  @OneToMany(() => TeamMember, teamMember => teamMember.team, { cascade: true, onDelete: 'CASCADE' })
  members: TeamMember[];

  @OneToMany(() => Role, role => role.team)
  roles: Role[];

  @OneToMany(() => TeamInvitation, teamInvitation => teamInvitation.team)
  teamInvitations: TeamInvitation[];

  @OneToMany(() => ProjectTeam, projectTeam => projectTeam.team)  
  projects: ProjectTeam[];

}
