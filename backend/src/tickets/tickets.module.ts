import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [ReservationsModule],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
