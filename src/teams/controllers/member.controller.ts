import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, Put, UnauthorizedException } from '@nestjs/common';
import { MembersService } from '../services/member.service';
import { AddMemberDto, UpdateMemberDto, DeleteMemberDto} from '../dto/members.dto';
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}
 
  //miembros

  //agregar un miembro
  @Post('add-member')
  async addMember(@Body() addMemberDto: AddMemberDto) {
    await this.membersService.addMember(addMemberDto);
    return { message: 'El miembro se ha agregado correctamente.' };
  }

  //obtener todos los miembros de un equipo
  @Get('get-members-team/:id')
  async findAllMembersTeams(@Param('id') id: number) {
    return this.membersService.findAllMembersTeam(id);
  }

  //actualizar miembro
  @Patch('update-member')
  async update(@Body() updateMemberDto: UpdateMemberDto) {
    await this.membersService.update(updateMemberDto);
    return { message: 'El miembro se ha actualizado correctamente.' };
  }

  //eliminar miembro
  @Delete('delete-member')
  async remove(@Body() deleteMemberDto: DeleteMemberDto) {
    await this.membersService.remove(deleteMemberDto);
    return { message: 'El miembro se ha eliminado correctamente.' };
  }

  //obtener todos los equipos de un usuario
  @Get('get-teams-user/:id')
  async findAllTeamsUser(@Param('id') id: number) {
    return this.membersService.findAllTeamsUser(id);
  }
}