import { PartialType } from "@nestjs/mapped-types";
import { SignupDto } from "../signup/signup.dto";

export class UpdateUserDto extends PartialType(SignupDto) {}
