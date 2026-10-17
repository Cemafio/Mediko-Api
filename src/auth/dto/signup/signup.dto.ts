
import { IsBoolean, IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  role: Role;

  @IsOptional()
  @IsBoolean()
  remember?: boolean;
}