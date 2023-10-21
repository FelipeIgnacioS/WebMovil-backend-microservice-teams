import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class JwtValidationGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    console.log("ingreso al middleware");
    console.log(token);

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      console.log("Token recibido en el microservicio de equipos:", token);
      // Enviar una solicitud HTTP al microservicio de Autenticación para validar el token
      const response = await this.httpService
        .get('http://localhost:3002/auth/validate-token', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .toPromise();
        console.log("Respuesta del servicio de autenticación:", response.data);
        if (response.data.isValid) {
          request.user = {
            id: response.data.userId,
          };
          return true;
        } else {
          throw new UnauthorizedException('Invalid token');
        }
    } catch (error) {
      throw new UnauthorizedException('Authentication service error');
    }
  }
}
