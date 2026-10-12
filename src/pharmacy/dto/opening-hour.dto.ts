import { IsInt, IsString, Matches, Max, Min } from 'class-validator';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export class OpeningHourDto {
  /** 0 = dimanche, 1 = lundi ... 6 = samedi */
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  /** Format strict "HH:mm", ex. "08:00" */
  @IsString()
  @Matches(TIME_REGEX, { message: 'opensAt doit être au format HH:mm (ex. 08:00)' })
  opensAt: string;

  @IsString()
  @Matches(TIME_REGEX, { message: 'closesAt doit être au format HH:mm (ex. 19:00)' })
  closesAt: string;
}