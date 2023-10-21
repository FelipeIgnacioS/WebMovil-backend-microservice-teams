import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entity/team.entity';
import { TeamMember } from '../team_members/entity/team_member.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,

    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
  ) {}

  async create(createTeamDto: CreateTeamDto, userId: number): Promise<Team> {
    const team = new Team();
    team.name = createTeamDto.name;
    team.description = createTeamDto.description;
    team.createdbyuserid = userId;

    const createdTeam = await this.teamsRepository.save(team);

    const teamMember = new TeamMember();
    teamMember.team_id = createdTeam.id;
    teamMember.user_id = userId;
    teamMember.role_id = 0; // id del rol de owner

    await this.teamMemberRepository.save(teamMember);

    return createdTeam;
  }

  async findAll(): Promise<Team[]> {
    return this.teamsRepository.find();
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamsRepository.findOne({ where: { id: id } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto, userId: number): Promise<Team> {
    const team = await this.teamsRepository.findOne({ where: { id: id } });
    
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    
    // Verificar si el usuario actual es el propietario del equipo
    if (team.createdbyuserid !== userId) {
      throw new NotFoundException('Only the owner can edit the team.');
    }
    
    // Actualizar los campos del equipo
    team.name = updateTeamDto.name;
    team.description = updateTeamDto.description;
  
    return this.teamsRepository.save(team);
  }

  async remove(id: number, userId: number): Promise<void> {
    const team = await this.findOne(id);
    
    if (team.createdbyuserid !== userId) {
      throw new NotFoundException('Only the owner can delete the team.');
    }

    await this.teamsRepository.delete(id);
  }
}

