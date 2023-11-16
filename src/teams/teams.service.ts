import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../infrastructure/team.entity';
import { TeamMember } from '../infrastructure/team-member.entity';
import { CreateTeamDto, UpdateTeamDto, DeleteTeamDto, DeleteMemberDto } from './dto/teams.dto';
import { CreateRoleDto, DeleteRoleDto, UpdateRoleDto } from './dto/roles.dto';
import { AddMemberDto, UpdateMemberDto } from './dto/members.dto';
import { Role } from '../infrastructure/role.entity';



@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,

    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    
  ) {}

  async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = new Team();
    team.name = createTeamDto.name;
    team.description = createTeamDto.description;
    team.creationDate =  createTeamDto.creationDate;
    team.createdByUserId = createTeamDto.createdByUserId;

    const createdTeam = await this.teamsRepository.save(team);

    const newMemeber = new TeamMember();
    newMemeber.team = createdTeam;
    newMemeber.userId = createdTeam.createdByUserId;
    newMemeber.role = await this.roleRepository.findOne({ where: { name: 'Owner' } });
    await this.teamMemberRepository.save(newMemeber);
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

  async update(updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.teamsRepository.findOne({ where: { id: updateTeamDto.idTeam } });
    
    console.log("funcion actualizar equipo: ", team);
    console.log("funcion s equipo: ", updateTeamDto);

    if (!team) {
      throw new NotFoundException(`Team with ID ${updateTeamDto.idTeam} not found`);
    }
    
    // Verificar si el usuario actual es el propietario del equipo
    if (team.createdByUserId !== updateTeamDto.idUser) {
      throw new NotFoundException('Only the owner can edit the team.');
    }
    
    // Actualizar los campos del equipo
    team.name = updateTeamDto.name;
    team.description = updateTeamDto.description;
  
    return this.teamsRepository.save(team);
  }

  async remove(deleteTeamDto: DeleteTeamDto): Promise<void> {
    const team = await this.findOne(deleteTeamDto.idTeam);
    
    if (team.createdByUserId !== deleteTeamDto.idUser) {
      throw new NotFoundException('Only the owner can delete the team.');
    }
    console.log("funcion eliminar equipo: ", team);
    //eliminar todos los registros en la tala teammember que tengan el id del equipo
    await this.teamMemberRepository.delete({ team: { id: team.id } });

    console.log("eliminados");
    await this.roleRepository.delete({ team: team });

    
    await this.teamsRepository.delete(team.id);
}




  async getTeamsUser(userId: number): Promise<any> {
    //obtener todos los equipos que tengan el id del usuario en la tabla de teammember
    const teamsUser = await this.teamMemberRepository.createQueryBuilder('teamMember')
      .leftJoinAndSelect('teamMember.team', 'team')
      .where('teamMember.userId = :userId', { userId })
      .getMany();
    console.log("equipos del usuario: ", teamsUser);
    return teamsUser;
  }

  //roles
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    console.log("ingreso al servicio create");
    const role = new Role();
    role.name = createRoleDto.name;
    role.description = createRoleDto.description;
    role.team = await this.findOne(createRoleDto.team_id);
    return this.roleRepository.save(role);
  }

  async getRolesTeams(teamId: number): Promise<Role[]> {
    return this.roleRepository.createQueryBuilder('role')
      .where('role.teamId = :teamId OR role.teamId = 0', { teamId })
      .getMany();
  }
  

  async getRoles(): Promise<Role[]> {
    return this.roleRepository.find({ where: { team: null } });
  }

  async updateRole(id ,updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id: id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    role.name = updateRoleDto.name;
    role.description = updateRoleDto.description;
    console.log("rol actualizado: ", role);
    return this.roleRepository.save(role);
  }

  async deleteRole(deleteRoleDto: DeleteRoleDto): Promise<void> {
    //debo buscar el rol que coincida con el idRole y el idTeam
    const role = await this.roleRepository.findOne({ where: { id: deleteRoleDto.idRole, team: { id: deleteRoleDto.idTeam } } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${deleteRoleDto.idRole} not found`);
    }
    await this.roleRepository.delete(role.id);
  }

  //members
  async addMember(addMemberDto: AddMemberDto): Promise<TeamMember> {
    const team = await this.findOne(addMemberDto.teamId);
    const member = await this.teamMemberRepository.findOne({ 
      where: { userId: addMemberDto.userId, team: team }
     });
    
    if (member) {
      throw new NotFoundException('The user is already a member of the team.');
    }

    const newMemeber = new TeamMember();
    newMemeber.team = team;
    newMemeber.userId = addMemberDto.userId;
    newMemeber.role = await this.roleRepository.findOne({ where: { name: 'Member' } });
    return this.teamMemberRepository.save(newMemeber);
  }

  async getMembers(teamId: number): Promise<TeamMember[]> {
    const team = await this.findOne(teamId);
    return this.teamMemberRepository.find({ where: { team : {id: team.id} }});
  }

  //arreglar
  async deleteMember(deleteMember: DeleteMemberDto): Promise<void> {
    const team = await this.findOne(deleteMember.idTeam);
    const member = await this.teamMemberRepository.findOne({ where: { id: deleteMember.idUser, team: team } });
    if (!member) {
      throw new NotFoundException(`Member with ID ${deleteMember.idUser} not found`);
    }
    await this.teamMemberRepository.delete(member.id);
  }

  async updateMember(updateMemberDto: UpdateMemberDto): Promise<TeamMember> {
    const team = await this.findOne(updateMemberDto.teamId);
    const member = await this.teamMemberRepository.findOne({ where: { id: updateMemberDto.userId, team: team } });
    if (!member) {
      throw new NotFoundException(`Member with ID ${updateMemberDto.userId} not found`);
    }
    member.role = await this.roleRepository.findOne({ where: { id: updateMemberDto.roleId } });
    return this.teamMemberRepository.save(member);
  }
  

}

