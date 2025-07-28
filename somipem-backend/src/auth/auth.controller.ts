import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string }) {
    try {
      const { email, password, name } = body;

      // Check if user already exists
      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new HttpException(
          'Un utilisateur avec cet email existe déjà',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const isFirstUser = (await this.prismaService.user.count()) === 0;
      const user = await this.prismaService.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: isFirstUser ? 'ADMIN' : 'WORKER',
        },
      });

      // Create JWT token
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      return { token };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        "Une erreur s'est produite lors de l'inscription",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const { email, password } = body;

      // Find user
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user || !user.password) {
        throw new HttpException(
          'Email ou mot de passe incorrect',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(
          'Email ou mot de passe incorrect',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Create JWT token
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      return { token };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        "Une erreur s'est produite lors de la connexion",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('callback')
  async handleCallback(@Body() body: { code: string }) {
    try {
      const { code } = body;
      
      // En production, nous ferions une vraie requête pour échanger le code
      // Pour l'instant, simulation pour le développement
      
      // Mock pour simuler l'échange de code contre un token
      const mockUserInfo = {
        sub: '123456',
        email: 'utilisateur@example.com',
        name: 'Utilisateur Test',
      };
      
      // Vérifier/créer l'utilisateur dans notre base de données
      let user = await this.prismaService.user.findUnique({
        where: { email: mockUserInfo.email },
      });
      
      if (!user) {
        // Si aucun utilisateur n'existe encore, le premier est ADMIN
        const isFirstUser = (await this.prismaService.user.count()) === 0;
        
        user = await this.prismaService.user.create({
          data: {
            email: mockUserInfo.email,
            name: mockUserInfo.name,
            role: isFirstUser ? 'ADMIN' : 'WORKER',
          },
        });
      }
      
      // Créer notre propre token JWT
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      
      return { token };
    } catch (error) {
      console.error('Erreur lors du traitement du callback:', error);
      throw new HttpException(
        "Une erreur s'est produite lors de l'authentification",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
