
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEmail, IsIn, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Role } from 'generated/prisma/enums';
import { OpeningHourDto } from 'src/pharmacy/dto/opening-hour.dto';

export class SignupPharmaDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  role:Role;

  @IsOptional()
  @IsBoolean()
  remember?: boolean;

  // -----------------------------------
    @IsString()
    @IsNotEmpty()
    address: string;
  
    @IsString()
    @IsNotEmpty()
    city: string;
  
    @IsString()
    @IsNotEmpty()
    phone: string;
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OpeningHourDto)
    openingHours?: OpeningHourDto[];
  
    @IsOptional()
    @IsLatitude()
    latitude?: number;
  
    @IsOptional()
    @IsLongitude()
    longitude?: number;
}