import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, Put, UnauthorizedException } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto, UpdateTeamDto, DeleteTeamDto, DeleteMemberDto } from './dto/teams.dto';
import { CreateRoleDto, DeleteRoleDto, UpdateRoleDto } from './dto/roles.dto';
import { AddMemberDto, UpdateMemberDto } from './dto/members.dto';
import { Role } from '../infrastructure/role.entity';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}
 
  //equipos

  //crear un equipo
  @Post('create-team')
  async create(@Body() createTeamDto: CreateTeamDto) {
    console.log("ingreso al controlador");
    await this.teamsService.createTeam(createTeamDto);
    return { message: 'El equipo se ha creado correctamente.' };
  }
  
  //obtener todos los equipos
  @Get('get-teams')
  findAll() {
    return this.teamsService.findAll();
  }

  //obtener un equipo por id
  @Get('get-team/:id')
  findOne(@Param('id') id: number) {
    return this.teamsService.findOne(id);
  }

  //actualizar equipo
  @Patch('update-team')
  async update(@Body() updateTeamDto: UpdateTeamDto) {
    await this.teamsService.update(updateTeamDto);
    return { message: 'El equipo se ha actualizado correctamente.' };
  }

  //eliminar equipo
  @Delete('delete-team')
  async remove(@Body() deleteTeamDto: DeleteTeamDto) {
    await this.teamsService.remove(deleteTeamDto);
    return { message: 'El equipo se ha eliminado correctamente.' };
  }

  //obtener todos los equipos de un usuario
  @Get('get-teams-user/:userId')
  async getTeamsUser(@Param('userId') userId: number) {
    console.log("ingreso al controlador: ", userId);
    return this.teamsService.getTeamsUser(userId);
  }

  //roles
  
  //crear un rol
  @Post('create-rol')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
  const team = await this.teamsService.findOne(createRoleDto.team_id);

  // Verificar si el usuario actual es el propietario del equipo
  if (team.createdByUserId !== createRoleDto.createdByUserId) {
    throw new UnauthorizedException('Solo el propietario puede crear un rol.');
  }

  await this.teamsService.createRole(createRoleDto);
  return { message: 'El rol se ha creado correctamente.' };
}

  //obtener todos los roles de un equipo mas los bases
  @Get('get-role-team/:teamId')
  async getRoles(@Param('teamId') teamId: number): Promise<Role[]> {
    return this.teamsService.getRolesTeams(teamId);
  }

  //obtener todos los roles base
  @Get('get-base-roles')
  async getBaseRoles(): Promise<Role[]> {
    return this.teamsService.getRoles(); // Obtener roles con team_id nulo
  }

  //actualizar un rol
  @Put('update-role/:id')
  async updateRole(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    console.log("ingreso a la funcion: ", id, " ", updateRoleDto.name, " ", updateRoleDto.description);
    await this.teamsService.updateRole(id, updateRoleDto);
    return { message: 'El rol se ha actualizado correctamente.' };
  }

  //eliminar un rol
  @Delete('delete-role')
  async deleteRole(@Body() deletRole: DeleteRoleDto) {
    await this.teamsService.deleteRole(deletRole);
    return { message: 'El rol se ha eliminado correctamente.'}
  }

  //meambers
  //agregar un miembro a un equipo
  @Post('add-member')
  async addMember(@Body() addMemberDto: AddMemberDto) {
    await this.teamsService.addMember(addMemberDto);
    return { message: 'El miembro se ha agregado correctamente.' };
  }

  //obtener todos los miembros de un equipo
  @Get('get-members/:teamId')
  async getMembers(@Param('teamId') teamId: number) {
    return this.teamsService.getMembers(teamId);
  }

  //eliminar un miembro de un equipo
  @Delete('delete-member')
  async deleteMember(@Body() deleteMember: DeleteMemberDto) {
    return this.teamsService.deleteMember(deleteMember);
  }

  //actualizar un miembro de un equipo
  @Put('update-member')
  async updateMember(@Body() updateMemberDto: UpdateMemberDto) {
    return this.teamsService.updateMember( updateMemberDto);
  }

}
