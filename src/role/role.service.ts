import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entity/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async getRoles(teamId: number | null): Promise<Role[]> {
    const roles = await this.roleRepository.find({ where: { team_id: teamId } });
    return roles;
  }

  async getRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id: id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.getRoleById(id);
    this.roleRepository.merge(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.getRoleById(id);
    await this.roleRepository.remove(role);
  }
}
