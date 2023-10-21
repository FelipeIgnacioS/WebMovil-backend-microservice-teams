import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' }) 
  team_id: number;

  @Column({ type: 'int' }) 
  user_id: number;

  @Column({ type: 'int' }) 
  role_id: number;
}
