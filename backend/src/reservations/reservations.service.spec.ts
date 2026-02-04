import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ReservationsService } from './reservations.service';
import { EventsService } from '../events/events.service';
import { 
  BadRequestException, 
  NotFoundException, 
  ConflictException, 
  ForbiddenException 
} from '@nestjs/common';
import { ReservationStatus } from '../common/enums/reservation-status.enum';
import { EventStatus } from '../common/enums/event-status.enum';
import { Types } from 'mongoose';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let mockReservationModel: any;
  let mockEventsService: any;

  const mockEvent = {
    _id: new Types.ObjectId(),
    title: 'Test Event',
    capacity: 50,
    status: EventStatus.PUBLISHED
  };

  const mockReservation = {
    _id: new Types.ObjectId(),
    event: mockEvent._id,
    participant: new Types.ObjectId(),
    status: ReservationStatus.PENDING,
    comment: 'Test comment',
    save: jest.fn(),
    populate: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    mockReservationModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      countDocuments: jest.fn(),
    };

    mockEventsService = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getModelToken('Reservation'),
          useValue: mockReservationModel,
        },
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReservation', () => {
    const eventId = mockEvent._id.toString();
    const participantId = new Types.ObjectId().toString();
    const dto = { comment: 'Test comment' };

    it('should throw BadRequestException for invalid event ID', async () => {
      await expect(
        service.createReservation('invalid-id', participantId, dto)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when event not found', async () => {
      mockEventsService.findById.mockResolvedValue(null);
      
      await expect(
        service.createReservation(eventId, participantId, dto)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for canceled event', async () => {
      mockEventsService.findById.mockResolvedValue({
        ...mockEvent,
        status: EventStatus.CANCELED
      });

      await expect(
        service.createReservation(eventId, participantId, dto)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for non-published event', async () => {
      mockEventsService.findById.mockResolvedValue({
        ...mockEvent,
        status: EventStatus.DRAFT
      });

      await expect(
        service.createReservation(eventId, participantId, dto)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException for existing active reservation', async () => {
      mockEventsService.findById.mockResolvedValue(mockEvent);
      mockReservationModel.findOne.mockResolvedValue(mockReservation);

      await expect(
        service.createReservation(eventId, participantId, dto)
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException when event is full', async () => {
      mockEventsService.findById.mockResolvedValue(mockEvent);
      mockReservationModel.findOne.mockResolvedValue(null);
      mockReservationModel.countDocuments.mockResolvedValue(50);

      await expect(
        service.createReservation(eventId, participantId, dto)
      ).rejects.toThrow(BadRequestException);
    });

    it('should create reservation successfully', async () => {
      const createdReservation = { ...mockReservation, ...dto };
      mockEventsService.findById.mockResolvedValue(mockEvent);
      mockReservationModel.findOne.mockResolvedValue(null);
      mockReservationModel.countDocuments.mockResolvedValue(0);
      mockReservationModel.create.mockResolvedValue(createdReservation);

      const result = await service.createReservation(eventId, participantId, dto);

      expect(mockReservationModel.create).toHaveBeenCalledWith({
        event: new Types.ObjectId(eventId),
        participant: new Types.ObjectId(participantId),
        status: ReservationStatus.PENDING,
        comment: dto.comment,
      });
      expect(result).toBe(createdReservation);
    });
  });

  describe('cancelReservation', () => {
    const reservationId = mockReservation._id.toString();
    const participantId = mockReservation.participant.toString();

    it('should throw BadRequestException for invalid reservation ID', async () => {
      await expect(
        service.cancelReservation('invalid-id', participantId)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when reservation not found', async () => {
      mockReservationModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(
        service.cancelReservation(reservationId, participantId)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for unauthorized cancel', async () => {
      const unauthorizedReservation = {
        ...mockReservation,
        participant: { toString: () => 'different-id' }
      };
      
      mockReservationModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(unauthorizedReservation)
      });

      await expect(
        service.cancelReservation(reservationId, participantId)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException for already canceled reservation', async () => {
      const canceledReservation = {
        ...mockReservation,
        status: ReservationStatus.CANCELED,
        participant: { toString: () => participantId }
      };
      
      mockReservationModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(canceledReservation)
      });

      await expect(
        service.cancelReservation(reservationId, participantId)
      ).rejects.toThrow(BadRequestException);
    });

    it('should cancel reservation successfully', async () => {
      const reservation = {
        ...mockReservation,
        participant: { toString: () => participantId },
        save: jest.fn().mockResolvedValue(mockReservation)
      };
      
      mockReservationModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(reservation)
      });

      const result = await service.cancelReservation(reservationId, participantId);

      expect(reservation.status).toBe(ReservationStatus.CANCELED);
      expect(reservation.save).toHaveBeenCalled();
      expect(result).toBe(reservation);
    });
  });

  describe('confirmReservation', () => {
    const reservationId = mockReservation._id.toString();

    it('should throw BadRequestException for invalid reservation ID', async () => {
      await expect(
        service.confirmReservation('invalid-id')
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when reservation not found', async () => {
      mockReservationModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await expect(
        service.confirmReservation(reservationId)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for non-pending reservation', async () => {
      const confirmedReservation = {
        ...mockReservation,
        status: ReservationStatus.CONFIRMED,
        event: mockEvent
      };
      
      mockReservationModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(confirmedReservation)
      });

      await expect(
        service.confirmReservation(reservationId)
      ).rejects.toThrow(BadRequestException);
    });

    it('should confirm reservation successfully', async () => {
      const reservation = {
        ...mockReservation,
        status: ReservationStatus.PENDING,
        event: mockEvent,
        save: jest.fn().mockResolvedValue(mockReservation)
      };
      
      mockReservationModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(reservation)
      });

      const result = await service.confirmReservation(reservationId);

      expect(reservation.status).toBe(ReservationStatus.CONFIRMED);
      expect(reservation.save).toHaveBeenCalled();
      expect(result).toBe(reservation);
    });
  });

  describe('getMyReservations', () => {
    const participantId = new Types.ObjectId().toString();

    it('should return user reservations', async () => {
      const mockReservations = [mockReservation];
      mockReservationModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockReservations)
        })
      });

      const result = await service.getMyReservations(participantId);

      expect(mockReservationModel.find).toHaveBeenCalledWith({
        participant: new Types.ObjectId(participantId)
      });
      expect(result).toBe(mockReservations);
    });
  });

  describe('getAllReservations', () => {
    it('should return all reservations without filters', async () => {
      const mockReservations = [mockReservation];
      mockReservationModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockReservations)
          })
        })
      });

      const result = await service.getAllReservations();

      expect(mockReservationModel.find).toHaveBeenCalledWith({});
      expect(result).toBe(mockReservations);
    });

    it('should apply filters correctly', async () => {
      const filters = {
        eventId: mockEvent._id.toString(),
        status: ReservationStatus.PENDING
      };
      
      mockReservationModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([])
          })
        })
      });

      await service.getAllReservations(filters);

      expect(mockReservationModel.find).toHaveBeenCalledWith({
        event: new Types.ObjectId(filters.eventId),
        status: filters.status
      });
    });
  });

  describe('findOne', () => {
    const reservationId = mockReservation._id.toString();

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(
        service.findOne('invalid-id')
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when reservation not found', async () => {
      mockReservationModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });

      await expect(
        service.findOne(reservationId)
      ).rejects.toThrow(NotFoundException);
    });

    it('should return reservation with populated fields', async () => {
      mockReservationModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockReservation)
        })
      });

      const result = await service.findOne(reservationId);

      expect(result).toBe(mockReservation);
    });
  });
});
