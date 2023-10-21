import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMembersService } from './team_member.service';
import { TeamMembersController } from './team_member.controller';
import { TeamMember } from './entity/team_member.entity';
import { RolesModule } from '../role/role.module';
import { HttpModule } from '@nestjs/axios'; 
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: 'futbolitos', // Reemplaza esto con tu clave secreta
    signOptions: { expiresIn: '60m' },
  }),HttpModule,
    TypeOrmModule.forFeature([TeamMember]),
    RolesModule 
  ],

  controllers: [TeamMembersController],
  providers: [TeamMembersService],
})
export class TeamMembersModule {}
