import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../infrastructure/team.entity';
import { TeamMember } from '../../infrastructure/team-member.entity';
import { CreateTeamDto, UpdateTeamDto, DeleteTeamDto } from '../dto/teams.dto';
import { Role, RoleName } from 'src/infrastructure/role.entity';
import { TeamInvitation } from 'src/infrastructure/team-invitation.entity';



@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,

    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(TeamInvitation)
    private readonly teamInvitationRepository: Repository<TeamInvitation>,
    
  ) {}

  async createTeam(createTeamDto: CreateTeamDto): Promise<void> {
    const team = new Team();
    team.name = createTeamDto.name;
    team.description = createTeamDto.description;
    team.createdByUserId = createTeamDto.createdByUserId;
    team.code = await this.generateUniqueCode();
    const createdTeam = await this.teamsRepository.save(team);

    // Obtener el rol 'Admin' (asumiendo que ya existe en la base de datos)
    const adminRole = await this.roleRepository.findOne({ where: { name: RoleName.Admin } });
    if (!adminRole) {
        throw new Error('El rol de administrador no existe.');
    }

    // Crear un nuevo miembro del equipo como administrador
    const newMember = new TeamMember();
    newMember.team = createdTeam;
    newMember.userId = createdTeam.createdByUserId;
    newMember.role = adminRole; // Asignar el rol 'Admin'
    await this.teamMemberRepository.save(newMember);
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

  async findOneByCode(code: string): Promise<Team> {
    const team = await this.teamsRepository.findOne({ where: { code: code } });
    if (!team) {
      throw new NotFoundException(`Team with code ${code} not found`);
    }
    return team;
  }

  async update(updateTeamDto: UpdateTeamDto): Promise<void> {
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
  
    await this.teamsRepository.save(team);
  }

  async remove(deleteTeamDto: DeleteTeamDto): Promise<void> {
    const team = await this.findOne(deleteTeamDto.idTeam);
    
    if (team.createdByUserId !== deleteTeamDto.idUser) {
      throw new NotFoundException('Only the owner can delete the team.');
    }
    console.log("funcion eliminar equipo: ", team);
    //eliminar todos los registros en la tala teammember que tengan el id del equipo
    await this.teamMemberRepository.delete({ team: { id: team.id } });
    //eliminar todos los registrons en la tabla de teamInvitations que tengan el id del equipo
    await this.teamInvitationRepository.delete({ team: { id: team.id } });

    
    await this.teamsRepository.delete(team.id);
  }




  //otras funciones
  private async generateUniqueCode(): Promise<string> {
    const MAX_ATTEMPTS = 10;
    let attempts = 0;
    while (attempts < MAX_ATTEMPTS) {
      const code = this.createCode();
      const codeExist = await this.teamsRepository.findOne({ where: { code: code } });
      if (!codeExist) {
        return code;
      }
      attempts++;
    }
    throw new Error('Unable to generate a unique team code.');
  }

  private createCode(): string {
    let code = '#';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 4; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

}

