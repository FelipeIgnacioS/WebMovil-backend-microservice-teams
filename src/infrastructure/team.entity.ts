import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { TeamMember } from './team-member.entity';
import { TeamInvitation } from './team-invitation.entity';
import { ProjectTeam } from './project-team.entity';  

@Entity('Team')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column('text', { nullable: false })
  description: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: false, name: 'createdbyuserid' })
  createdByUserId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;


  @OneToMany(() => TeamMember, teamMember => teamMember.team, { cascade: true, onDelete: 'CASCADE' })
  members: TeamMember[];

  @OneToMany(() => TeamInvitation, teamInvitation => teamInvitation.team)
  teamInvitations: TeamInvitation[];

  @OneToMany(() => ProjectTeam, projectTeam => projectTeam.team)  
  projects: ProjectTeam[];

}
