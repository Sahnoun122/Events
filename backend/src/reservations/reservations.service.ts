import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation , ReservationDocument } from './reservation.schema';
import { ReservationStatus } from '../common/enums/reservation-status.enum';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { EventStatus } from '../common/enums/event-status.enum';
import { EventsService } from '../events/events.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
    private readonly eventsService: EventsService,
  ) {}

  async createReservation(
    eventId: string,
    participantId: string,
    dto: CreateReservationDto,
  ) {
    if (!Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException('Invalid event ID');
    }

    const event = await this.eventsService.findById(eventId);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status === EventStatus.CANCELED) {
      throw new BadRequestException('Event is canceled');
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Event is not published');
    }

    const existingReservation = await this.reservationModel.findOne({
      event: new Types.ObjectId(eventId),
      participant: new Types.ObjectId(participantId),
      status: { $in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
    });

    if (existingReservation) {
      throw new ConflictException('You already have an active reservation');
    }

    const confirmedCount = await this.reservationModel.countDocuments({
      event: new Types.ObjectId(eventId),
      status: ReservationStatus.CONFIRMED,
    });

    if (confirmedCount >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    const reservation = await this.reservationModel.create({
      event: new Types.ObjectId(eventId),
      participant: new Types.ObjectId(participantId),
      status: ReservationStatus.PENDING,
      comment: dto.comment,
    });

    return reservation;
  }


  async getMyReservations(participantId: string) {
    console.log('Recherche de réservations pour l\'utilisateur:', participantId);
    
    const reservations = await this.reservationModel
      .find({ participant: new Types.ObjectId(participantId) })
      .populate('event')
      .sort({ createdAt: -1 });
    
    console.log('📋 Réservations trouvées:', reservations.length, reservations);
    return reservations;
  }


  async cancelReservation(reservationId: string, participantId: string) {
    if (!Types.ObjectId.isValid(reservationId)) {
      throw new BadRequestException('Invalid reservation ID');
    }

    const reservation = await this.reservationModel
      .findById(reservationId)
      .populate('event');

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.participant.toString() !== participantId.toString()) {
      throw new ForbiddenException('You cannot cancel this reservation');
    }

    if (reservation.status === ReservationStatus.CANCELED) {
      throw new BadRequestException('Reservation already canceled');
    }

    if (reservation.status === ReservationStatus.REFUSED) {
      throw new BadRequestException('Cannot cancel a refused reservation');
    }

    reservation.status = ReservationStatus.CANCELED;
    await reservation.save();

    return reservation;
  }


  async getAllReservations(filters?: {
    eventId?: string;
    participantId?: string;
    status?: ReservationStatus;
  }) {
    const query: any = {};

    if (filters?.eventId) {
      if (!Types.ObjectId.isValid(filters.eventId)) {
        throw new BadRequestException('Invalid event ID');
      }
      query.event = new Types.ObjectId(filters.eventId);
    }

    if (filters?.participantId) {
      if (!Types.ObjectId.isValid(filters.participantId)) {
        throw new BadRequestException('Invalid participant ID');
      }
      query.participant = new Types.ObjectId(filters.participantId);
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    return await this.reservationModel
      .find(query)
      .populate('event')
      .populate('participant')
      .sort({ createdAt: -1 });
  }

 
  async confirmReservation(reservationId: string) {
    if (!Types.ObjectId.isValid(reservationId)) {
      throw new BadRequestException('Invalid reservation ID');
    }

    const reservation = await this.reservationModel
      .findById(reservationId)
      .populate('event');

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException(
        'Only PENDING reservations can be confirmed',
      );
    }

    const event: any = reservation.event;

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Event is not published');
    }

    if (event.status === EventStatus.CANCELED) {
      throw new BadRequestException('Event is canceled');
    }

    const confirmedCount = await this.reservationModel.countDocuments({
      event: event._id,
      status: ReservationStatus.CONFIRMED,
    });

    if (confirmedCount >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    reservation.status = ReservationStatus.CONFIRMED;
    await reservation.save();

    return reservation;
  }

  async refuseReservation(reservationId: string) {
    if (!Types.ObjectId.isValid(reservationId)) {
      throw new BadRequestException('Invalid reservation ID');
    }

    const reservation = await this.reservationModel.findById(reservationId);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only PENDING reservations can be refused');
    }

    reservation.status = ReservationStatus.REFUSED;
    await reservation.save();

    return reservation;
  }


  async adminCancelReservation(reservationId: string) {
    if (!Types.ObjectId.isValid(reservationId)) {
      throw new BadRequestException('Invalid reservation ID');
    }

    const reservation = await this.reservationModel.findById(reservationId);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status === ReservationStatus.CANCELED) {
      throw new BadRequestException('Reservation already canceled');
    }

    reservation.status = ReservationStatus.CANCELED;
    await reservation.save();

    return reservation;
  }


  async findOne(reservationId: string) {
    if (!Types.ObjectId.isValid(reservationId)) {
      throw new BadRequestException('Invalid reservation ID');
    }

    const reservation = await this.reservationModel
      .findById(reservationId)
      .populate('event')
      .populate('participant');

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }
}
