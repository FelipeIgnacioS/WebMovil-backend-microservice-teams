import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsModule } from './teams/teams.module'; // Importa tus módulos aquí
import { RolesModule } from './role/role.module'; // Importa tus módulos aquí
import { TeamMembersModule } from './team_members/team_member.module'; // Importa tus módulos aquí
import { JwtValidationGuard  } from './middleware/jwt-validation.middleware'; // Importa tu middleware aquí
import { APP_GUARD } from '@nestjs/core';
import config from '../ormconfig';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TeamsModule,
    RolesModule,
    TeamMembersModule,
    HttpModule,
    JwtModule.register({
      secret: 'futbolitos', // Reemplaza esto con tu clave secreta
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtValidationGuard , 
    },
  ],
})
export class AppModule {}
