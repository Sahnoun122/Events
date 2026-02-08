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
      user.id,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PARTICIPANT)
  @Get('me')
  async getMyReservations(@CurrentUser() user: any) {
    return await this.reservationsService.getMyReservations(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PARTICIPANT)
  @Get('me/stats')
  async getMyStats(@CurrentUser() user: any) {
    const myReservations = await this.reservationsService.getMyReservations(user.id);
    
    const stats = {
      totalReservations: myReservations.length,
      confirmed: myReservations.filter(r => r.status === ReservationStatus.CONFIRMED).length,
      pending: myReservations.filter(r => r.status === ReservationStatus.PENDING).length,
      canceled: myReservations.filter(r => r.status === ReservationStatus.CANCELED).length,
      refused: myReservations.filter(r => r.status === ReservationStatus.REFUSED).length,
      
      upcomingEvents: myReservations
        .filter(r => r.status === ReservationStatus.CONFIRMED)
        .filter(r => {
          const event = r.event as any;
          if (!event || !event.date) return false;
          const eventDate = new Date(event.date);
          return eventDate > new Date();
        })
        .sort((a, b) => {
          const eventA = a.event as any;
          const eventB = b.event as any;
          return new Date(eventA.date).getTime() - new Date(eventB.date).getTime();
        })
        .slice(0, 5)
        .map(r => {
          const event = r.event as any;
          return {
            reservationId: r._id,
            eventId: event._id,
            eventTitle: event.title,
            date: event.date,
            location: event.location,
            status: r.status
          };
        }),
      
      recentActivity: myReservations
        .sort((a, b) => {
          const aCreated = (a as any).createdAt || new Date();
          const bCreated = (b as any).createdAt || new Date();
          return new Date(bCreated).getTime() - new Date(aCreated).getTime();
        })
        .slice(0, 5)
        .map(r => {
          const event = r.event as any;
          const reservation = r as any;
          return {
            reservationId: r._id,
            eventTitle: event ? event.title : 'Événement',
            status: r.status,
            createdAt: reservation.createdAt,
            eventDate: event ? event.date : null
          };
        })
    };
    
    return stats;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/dashboard')
  async getDashboardStats() {
    const allReservations = await this.reservationsService.getAllReservations();
    
    const stats = {
      total: allReservations.length,
      pending: allReservations.filter(r => r.status === ReservationStatus.PENDING).length,
      confirmed: allReservations.filter(r => r.status === ReservationStatus.CONFIRMED).length,
      canceled: allReservations.filter(r => r.status === ReservationStatus.CANCELED).length,
      refused: allReservations.filter(r => r.status === ReservationStatus.REFUSED).length,
      
      byEvent: allReservations.reduce((acc, reservation) => {
        const eventId = (reservation.event._id || reservation.event).toString();
        if (!acc[eventId]) {
          const isPopulated = reservation.event && typeof reservation.event === 'object' && 'title' in reservation.event;
          acc[eventId] = {
            eventTitle: isPopulated ? (reservation.event as any).title : 'Événement',
            capacity: isPopulated ? (reservation.event as any).capacity || 0 : 0,
            confirmed: 0,
            pending: 0,
            total: 0
          };
        }
        
        acc[eventId].total++;
        if (reservation.status === ReservationStatus.CONFIRMED) {
          acc[eventId].confirmed++;
        } else if (reservation.status === ReservationStatus.PENDING) {
          acc[eventId].pending++;
        }
        
        return acc;
      }, {} as any)
    };
    
    return stats;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('stats')
  async getReservationStats() {
    const allReservations = await this.reservationsService.getAllReservations();
    
    const stats = {
      total: allReservations.length,
      pending: allReservations.filter(r => r.status === ReservationStatus.PENDING).length,
      confirmed: allReservations.filter(r => r.status === ReservationStatus.CONFIRMED).length,
      canceled: allReservations.filter(r => r.status === ReservationStatus.CANCELED).length,
      refused: allReservations.filter(r => r.status === ReservationStatus.REFUSED).length,
    };
    
    return stats;
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
      user.id,
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
