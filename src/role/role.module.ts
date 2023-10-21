import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './role.controller';
import { RolesService } from './role.service';
import { Role } from './entity/role.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: 'futbolitos', // Reemplaza esto con tu clave secreta
    signOptions: { expiresIn: '60m' },
  }),HttpModule,TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
