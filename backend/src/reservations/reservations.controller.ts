import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationStatus } from 'src/common/enums/reservation-status.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PARTICIPANT)
  @Post(':eventId')
  async createReservation(
    @Param('eventId') eventId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateReservationDto,
  ) {
    return await this.reservationsService.createReservation(
      eventId,
      user._id,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PARTICIPANT)
  @Get('me')
  async getMyReservations(@CurrentUser() user: any) {
    return await this.reservationsService.getMyReservations(user._id);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PARTICIPANT)
  @Patch(':id/cancel')
  async cancelReservation(
    @Param('id') reservationId: string,
    @CurrentUser() user: any,
  ) {
    return await this.reservationsService.cancelReservation(
      reservationId,
      user._id,
    );
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllReservations(
    @Query('eventId') eventId?: string,
    @Query('participantId') participantId?: string,
    @Query('status') status?: ReservationStatus,
  ) {
    return await this.reservationsService.getAllReservations({
      eventId,
      participantId,
      status,
    });
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/confirm')
  async confirmReservation(@Param('id') reservationId: string) {
    return await this.reservationsService.confirmReservation(reservationId);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/refuse')
  async refuseReservation(@Param('id') reservationId: string) {
    return await this.reservationsService.refuseReservation(reservationId);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/admin-cancel')
  async adminCancelReservation(@Param('id') reservationId: string) {
    return await this.reservationsService.adminCancelReservation(reservationId);
  }
}
