import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Team } from './team.entity';
import { TeamMember } from './team-member.entity';

@Entity('Role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => Team, team => team.roles)
  team: Team;

  @OneToMany(() => TeamMember, teamMember => teamMember.role)
  members: TeamMember[];
}
