import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember } from './entity/team_member.entity';
import { AssignMemberDto } from './dto/assign-member.dto';
import { UpdateRoleDto } from './dto/updateRole';
import { RolesService } from '../role/role.service';

@Injectable()
export class TeamMembersService {
  constructor(
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    private readonly roleService: RolesService, //inyecto para validar roles
  ) {}

  async assignMember(assignMemberDto: AssignMemberDto): Promise<TeamMember> {
    // falta validad roles y usuario
    const { team_id, user_id, role_id } = assignMemberDto;

    // Verificar si el usuario ya es miembro del equipo
    const existingMember = await this.teamMemberRepository.findOne({ where: { team_id, user_id } });
    if (existingMember) {
      throw new BadRequestException('El usuario ya es miembro del equipo.');
    }

    // Verificar si el role_id es válido
    const role = await this.roleService.getRoleById(role_id);
    if (!role) {
      throw new NotFoundException('Rol no encontrado.');
    }

    const teamMember = new TeamMember();
    teamMember.team_id = team_id;
    teamMember.user_id = user_id;
    teamMember.role_id = role_id;

    return this.teamMemberRepository.save(teamMember);
  }

  async removeMember(teamId: number, userId: number): Promise<void> {
    // validad usuario y rol
    const member = await this.teamMemberRepository.findOne({ where: { team_id: teamId, user_id: userId } });

    if (!member) {
      throw new NotFoundException('Miembro no encontrado.');
    }

    await this.teamMemberRepository.remove(member);
  }

  async updateRole(teamId: number, userId: number, updateRoleDto: UpdateRoleDto): Promise<TeamMember> {
    //validar usuario role
    const { role_id } = updateRoleDto;

    // Verificar si el role_id es válido
    const role = await this.roleService.getRoleById(role_id);
    if (!role) {
      throw new NotFoundException('Rol no encontrado.');
    }

    // Verificar si el miembro existe
    const member = await this.teamMemberRepository.findOne({ where: { team_id: teamId, user_id: userId } });

    if (!member) {
      throw new NotFoundException('Miembro no encontrado.');
    }

    member.role_id = role_id;
    return this.teamMemberRepository.save(member);
  }
}
