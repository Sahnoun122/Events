import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReservationDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  comment?: string;
}
