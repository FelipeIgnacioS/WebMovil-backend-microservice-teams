import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, Put, UnauthorizedException } from '@nestjs/common';
import { TeamsService } from '../services/team.service';
import { CreateTeamDto, UpdateTeamDto, DeleteTeamDto} from '../dto/teams.dto';
import { Console } from 'console';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}
 
  //equipos

  //crear un equipo
  @Post('create-team')
  async create(@Body() createTeamDto: CreateTeamDto) {
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

  //obtener un equipo por codigo
  @Get('get-team-code/:code')
  findOneByCode(@Param('code') code: string) {
    console.log("ingreso al al get code:", code);
    return this.teamsService.findOneByCode(code);
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
}
