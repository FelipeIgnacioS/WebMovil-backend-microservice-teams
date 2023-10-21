import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JwtValidationGuard } from '../middleware/jwt-validation.middleware';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  //funciona
  @UseGuards(JwtValidationGuard) // Protege esta ruta con autenticación JWT
  @Post('create')
  async create(@Body() createTeamDto: CreateTeamDto, @Req() req) {
    console.log("ingreso al controlador");
    const userId = req.user.id;
    return this.teamsService.create(createTeamDto, userId);
  }

  //funciona
  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  //funciona
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  //actualizar equipo funciona
  @UseGuards(JwtValidationGuard) // Protege esta ruta con autenticación JWT
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto, @Req() req) {
    // Obtén el usuario actual a través del objeto req
    const userId = req.user.id;
    return this.teamsService.update(+id, updateTeamDto, userId);
  }

  //falta agregar eliminar en la tabla de team_members para no violar restricciones
  @UseGuards(JwtValidationGuard) // Protege esta ruta con autenticación JWT
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    // Obtén el usuario actual a través del objeto req
    const userId = req.user.id;
    return this.teamsService.remove(+id, userId);
  }
}
