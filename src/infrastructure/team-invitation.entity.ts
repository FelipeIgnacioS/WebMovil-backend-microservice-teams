import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Team } from './team.entity';

@Entity('TeamInvitation')
export class TeamInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, team => team.teamInvitations)  // Corregido aquí
  team: Team;

  @Column()
  invitedUserId: number;

  @Column({ length: 255, nullable: false })
  status: string;

}
