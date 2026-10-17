import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup/signup.dto';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/signin.dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { PharmacyService } from 'src/pharmacy/pharmacy.service';
import { CreatePharmacyDto } from 'src/pharmacy/dto/create-pharmacy.dto';
import { OpeningHourDto } from 'src/pharmacy/dto/opening-hour.dto';
import { SignupPharmaDto } from './dto/signup/signupPharma.dto';
import { UpdateUserDto } from './dto/user.dto/update.dto';

function validateHours(hours: OpeningHourDto[] = []) {
    for (const h of hours) {
        if (h.opensAt === h.closesAt) {
            throw new BadRequestException(
                `Jour ${h.dayOfWeek} : l'ouverture et la fermeture doivent être différentes.`,
            );
        }
    }

    // Deux plages identiques le même jour violeraient la contrainte unique
    const keys = hours.map((h) => `${h.dayOfWeek}-${h.opensAt}`);
    if (new Set(keys).size !== keys.length) {
        throw new BadRequestException('Plages horaires en double.');
    }
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async signup(signupDto: SignupDto) {
        const hashedPassword = await bcrypt.hash(signupDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: signupDto.email,
                password: hashedPassword,
                name: signupDto.name,
                role: signupDto.role
            },
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException("Utilisateur introuvable.");
        }

        const data: {
            email?: string;
            password?: string;
            name?: string;
            role?: UpdateUserDto["role"];
            remember?: boolean;
        } = {};

        if (updateUserDto.email !== undefined) {
            data.email = updateUserDto.email;
        }

        if (updateUserDto.name !== undefined) {
            data.name = updateUserDto.name;
        }

        if (updateUserDto.role !== undefined) {
            data.role = updateUserDto.role;
        }

        if (updateUserDto.remember !== undefined) {
            data.remember = updateUserDto.remember;
        }

        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data,
            });

            // Ne jamais retourner le mot de passe hashé.
            const { password, ...result } = updatedUser;
            return result;

        } catch (error: any) {
            if (error.code === "P2002") {
                throw new ConflictException("Cette adresse email est déjà utilisée.");
            }

            throw error;
        }
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

    async getAllProfiles() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        return users;
    }

    async signupPharmacie(dtoPharma: SignupPharmaDto) {
        const { openingHours, address, city, phone, email, name, role } = dtoPharma;
        validateHours(openingHours);

        const hashedPassword = await bcrypt.hash(dtoPharma.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dtoPharma.email,
                password: hashedPassword,
                name: dtoPharma.name,
                role: role
            },
        });

        const pharma = await this.prisma.pharmacy.create({
            data: {
                address,
                city,
                email,
                name,
                phone,
                openingHours: openingHours?.length
                    ? { create: openingHours }
                    : undefined,
            },
            include: { openingHours: true },
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            address: pharma.address,
            phone: pharma.phone,
            city: pharma.city,
            createdAt: user.createdAt,
        };
    }
}