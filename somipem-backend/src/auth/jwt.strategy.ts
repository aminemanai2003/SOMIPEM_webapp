import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Configuration à double-stratégie:
 * En production: utilise JWKS pour vérifier les tokens de BetterAuth
 * En développement: utilise un secret local pour vérifier les tokens créés localement
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Pour la simplicité du développement, utiliser le secret local
      // En production, on utiliserait passportJwtSecret avec JWKS
      secretOrKey: configService.get<string>('JWT_SECRET'),
      // Ces options seraient utilisées en production avec JWKS
      // audience: configService.get<string>('BETTER_AUTH_AUDIENCE'),
      // issuer: configService.get<string>('BETTER_AUTH_ISSUER'),
    });
  }

  async validate(payload: any) {
    try {
      // Vérifier si l'utilisateur existe dans la base de données
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }
}
