import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ReservationsModule } from './reservations/reservations.module';
import { TicketsModule } from './tickets/tickets.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/events'),
    AuthModule,
    EventsModule,
    ReservationsModule,
    TicketsModule,
   
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
