import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Team } from './team.entity';
import { Role } from './role.entity';

@Entity()
export class TeamMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Team)
    @JoinColumn({ name: 'teamId' })
    team: Team;

    @Column()
    teamId: number;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @Column()
    roleId: number;

    @Column()
    userId: number; 
}
