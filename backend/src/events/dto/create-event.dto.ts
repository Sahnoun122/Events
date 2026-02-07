import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { EventStatus } from 'src/common/enums/event-status.enum';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;
}
