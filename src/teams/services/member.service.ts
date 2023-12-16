import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddMemberDto, UpdateMemberDto, DeleteMemberDto} from '../dto/members.dto';
import { Team } from 'src/infrastructure/team.entity';
import { TeamMember } from 'src/infrastructure/team-member.entity';

import { fetchUserDetails } from 'src/middleware/member';
import { Role } from 'src/infrastructure/role.entity';
import { RoleName } from 'src/infrastructure/role.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

async addMember(addMemberDto: AddMemberDto) {
    const team = await this.teamRepository.findOne({ where: { id: addMemberDto.teamId } });
    if (!team) {
        throw new NotFoundException('El equipo no existe.');
    }

    const memberRole = await this.roleRepository.findOne({ 
      where: { name: RoleName.Member } 
    });
    if (!memberRole) {
      throw new NotFoundException('El rol no existe.');
    }

    const member = new TeamMember();
    member.team = team;
    member.userId = addMemberDto.userId;
    member.role = memberRole;
    //verificamos si el usuario no esa en el equipo
    const memberExists = await this.teamMemberRepository.findOne({ where: { userId: addMemberDto.userId, team: { id: addMemberDto.teamId } } });
    if (memberExists) {
        throw new NotFoundException('El miembro ya existe.');
    }

    await this.teamMemberRepository.save(member);
}

async findAllMembersTeam(id: number) {
  const team = await this.teamRepository.findOne({ where: { id: id } });
  if (!team) {
    throw new NotFoundException('El equipo no existe.');
  }

  // Obtener todos los miembros del equipo y sus roles
  const members = await this.teamMemberRepository.find({ 
    where: { team: { id: id } },
    relations: ['role']  // Incluir la relación con los roles
  });

  // Extraer IDs de usuario y mapear roles
  const userDetailsRequests = members.map(member => member.userId);
  const roleMapping = new Map(members.map(member => [member.userId, member.role.name]));

  if (userDetailsRequests.length === 0) {
    throw new NotFoundException('No se encontraron miembros para este equipo.');
  }

  try {
    const userDetails = await fetchUserDetails(userDetailsRequests);

    // Combinar detalles de usuario con nombres de roles
    return userDetails.map(user => ({
      ...user,
      roleName: roleMapping.get(user.id)
    }));
  } catch (error) {
    throw new Error('No se pudieron obtener los detalles de los usuarios');
  }
}


async update(updateMemberDto: UpdateMemberDto) {
  console.log("updateMemberDto", updateMemberDto);
  const team = await this.teamRepository.findOne({ where: { id: updateMemberDto.idTeam } });
  console.log("team", team);

  if (!team) {
    throw new NotFoundException('El equipo no existe.');
  }

  // Verificar si el usuario que realiza la acción es el propietario del equipo
  if (team.createdByUserId !== updateMemberDto.userId) {
    throw new UnauthorizedException('Solo el propietario del equipo puede actualizar a los miembros.');
  }

  const member = await this.teamMemberRepository.findOne({
    where: {
      userId: updateMemberDto.idUser,
      team: { id: updateMemberDto.idTeam }
    },
  });

  if (!member) {
    throw new NotFoundException('El miembro no existe.');
  }

  const role = await this.roleRepository.findOne({ where: { name: updateMemberDto.newRoleName as RoleName } });

  if (!role) {
    throw new NotFoundException('El rol no existe.');
  }
  console.log("meber", member);
  console.log("team", team);
  // Evitar cambiar el rol del propietario del equipo
  if (member.userId === team.createdByUserId) {
    throw new UnauthorizedException('No se puede cambiar el rol del propietario del equipo.');
  }

  // Evitar asignar otro propietario
  if (role.name === RoleName.Admin && team.createdByUserId !== member.userId) {
    throw new UnauthorizedException('No se puede asignar otro propietario.');
  }

  member.role = role;
  console.log("member", member);
  await this.teamMemberRepository.save(member);
}

  
  

  async remove(deleteMemberDto: DeleteMemberDto) {
    const team = await this.teamRepository.findOne({ where: { id: deleteMemberDto.idTeam } });
    if (!team) {
      throw new NotFoundException('El equipo no existe.');
    }
  
    if (team.createdByUserId === deleteMemberDto.idUser) {
      throw new UnauthorizedException('No se puede eliminar al propietario del equipo.');
    }
  
    const member = await this.teamMemberRepository.findOne({
      where: {
        userId: deleteMemberDto.idUser,
        team: { id: deleteMemberDto.idTeam }
      },
    });
    
    if (!member) {
      throw new NotFoundException('El miembro no existe.');
    }
  
    await this.teamMemberRepository.remove(member);
  }
  

  async findAllTeamsUser(id: number) {
    //hacer una query para obtener los equipos a los que pertece un usuario y tener la informacion de los equipos 
    const teams = await this.teamRepository
      .createQueryBuilder('team')
      .innerJoin('team.members', 'member')
      .where('member.userId = :id', { id: id })
      .getMany();

    if (teams.length === 0) {
        throw new NotFoundException('El usuario no pertenece a ningun equipo.');
    }
    return teams;
  }
  
  async leaveTeam (leaveTeamDto: DeleteMemberDto) {
    const team = await this.teamRepository.findOne({ where: { id: leaveTeamDto.idTeam } });
    if (!team) {
      throw new NotFoundException('El equipo no existe.');
    }
  
    if (team.createdByUserId === leaveTeamDto.idUser) {
      throw new UnauthorizedException('No se puede eliminar al propietario del equipo.');
    }
  
    const member = await this.teamMemberRepository.findOne({
      where: {
        userId: leaveTeamDto.idUser,
        team: { id: leaveTeamDto.idTeam }
      },
    });
    
    if (!member) {
      throw new NotFoundException('El miembro no existe.');
    }
  
    await this.teamMemberRepository.remove(member);
  }

}