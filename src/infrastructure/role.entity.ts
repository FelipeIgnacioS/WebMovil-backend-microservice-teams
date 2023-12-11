import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';


export enum RoleName {
  Admin = 'Admin',
  Member = 'Member',
  Developer = 'Developer',
}

@Entity('Role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleName,
    default: RoleName.Member,
  })
  name: RoleName;

  @Column('text', { nullable: true })
  description: string;

}
