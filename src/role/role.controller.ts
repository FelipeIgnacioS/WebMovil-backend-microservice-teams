import { Controller, Post, Get, Param, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entity/role.entity';
import { JwtValidationGuard } from '../middleware/jwt-validation.middleware';


@Controller('roles')
@UseGuards(JwtValidationGuard) 
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get(':teamId')
  async getRoles(@Param('teamId') teamId: number): Promise<Role[]> {
    return this.rolesService.getRoles(teamId);
  }

  @Get()
  async getBaseRoles(): Promise<Role[]> {
    return this.rolesService.getRoles(null); // Obtener roles con team_id nulo
  }

  @Get(':id')
  async getRoleById(@Param('id') id: number): Promise<Role> {
    return this.rolesService.getRoleById(id);
  }

  @Put(':id')
  async updateRole(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: number): Promise<void> {
    return this.rolesService.deleteRole(id);
  }
}
