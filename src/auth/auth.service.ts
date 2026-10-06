import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup/signup.dto';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/signin.dto/signin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

  async signup(signupDto: SignupDto) {
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: signupDto.email,
        password: hashedPassword,
        name: signupDto.name,
      },
    });
  }

  async signin(signinDto: SigninDto) {
        const user = await this.prisma.user.findUnique({
            where: {
            email: signinDto.email,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Email incorrect');
        }

        const passwordMatch = await bcrypt.compare(
            signinDto.password,
            user.password,
        );

        if (!passwordMatch) {
            throw new UnauthorizedException('Mot de passe incorrect');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            access_token: accessToken,
        };
    }
}