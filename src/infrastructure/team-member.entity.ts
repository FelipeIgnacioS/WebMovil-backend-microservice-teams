import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Team } from './team.entity';
import { Role } from './role.entity';

@Entity('TeamMember')
export class TeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, team => team.members)
  team: Team;

  @Column()
  userId: number;

  @ManyToOne(() => Role, role => role.members)
  role: Role;
}
