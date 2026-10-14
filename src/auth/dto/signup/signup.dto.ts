
import { IsBoolean, IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  remember?: boolean;
}