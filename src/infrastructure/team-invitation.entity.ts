import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Team } from './team.entity';

export enum InvitationStatus {
  Pending = 'PENDING',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  Cancelled = 'CANCELLED',
}

@Entity('TeamInvitation')
export class TeamInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, team => team.teamInvitations)  // Corregido aquí
  team: Team;

  @Column()
  invitedUserId: number;

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