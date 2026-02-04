import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ReservationStatus } from '../common/enums/reservation-status.enum';
import { Types } from 'mongoose';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  const mockReservationsService = {
    createReservation: jest.fn(),
    getMyReservations: jest.fn(),
    cancelReservation: jest.fn(),
    getAllReservations: jest.fn(),
    confirmReservation: jest.fn(),
    refuseReservation: jest.fn(),
    adminCancelReservation: jest.fn(),
  };

  const mockUser = {
    _id: new Types.ObjectId().toString(),
    email: 'test@example.com',
    role: 'PARTICIPANT',
  };

  const mockReservation = {
    _id: new Types.ObjectId(),
    event: new Types.ObjectId(),
    participant: mockUser._id,
    status: ReservationStatus.PENDING,
    comment: 'Test comment',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReservation', () => {
    const eventId = new Types.ObjectId().toString();
    const dto = { comment: 'Test reservation' };

    it('should create a reservation successfully', async () => {
      mockReservationsService.createReservation.mockResolvedValue(mockReservation);

      const result = await controller.createReservation(eventId, mockUser, dto);

      expect(service.createReservation).toHaveBeenCalledWith(eventId, mockUser._id, dto);
      expect(result).toBe(mockReservation);
    });
  });

  describe('getMyReservations', () => {
    it('should return user reservations', async () => {
      const mockReservations = [mockReservation];
      mockReservationsService.getMyReservations.mockResolvedValue(mockReservations);

      const result = await controller.getMyReservations(mockUser);

      expect(service.getMyReservations).toHaveBeenCalledWith(mockUser._id);
      expect(result).toBe(mockReservations);
    });
  });

  describe('cancelReservation', () => {
    const reservationId = mockReservation._id.toString();

    it('should cancel a reservation successfully', async () => {
      const canceledReservation = { ...mockReservation, status: ReservationStatus.CANCELED };
      mockReservationsService.cancelReservation.mockResolvedValue(canceledReservation);

      const result = await controller.cancelReservation(reservationId, mockUser);

      expect(service.cancelReservation).toHaveBeenCalledWith(reservationId, mockUser._id);
      expect(result).toBe(canceledReservation);
    });
  });

  describe('getAllReservations', () => {
    it('should return all reservations without filters', async () => {
      const mockReservations = [mockReservation];
      mockReservationsService.getAllReservations.mockResolvedValue(mockReservations);

      const result = await controller.getAllReservations();

      expect(service.getAllReservations).toHaveBeenCalledWith({
        eventId: undefined,
        participantId: undefined,
        status: undefined,
      });
      expect(result).toBe(mockReservations);
    });

    it('should return all reservations with filters', async () => {
      const eventId = new Types.ObjectId().toString();
      const participantId = new Types.ObjectId().toString();
      const status = ReservationStatus.CONFIRMED;
      const mockReservations = [mockReservation];
      
      mockReservationsService.getAllReservations.mockResolvedValue(mockReservations);

      const result = await controller.getAllReservations(eventId, participantId, status);

      expect(service.getAllReservations).toHaveBeenCalledWith({
        eventId,
        participantId,
        status,
      });
      expect(result).toBe(mockReservations);
    });
  });

  describe('confirmReservation', () => {
    const reservationId = mockReservation._id.toString();

    it('should confirm a reservation successfully', async () => {
      const confirmedReservation = { ...mockReservation, status: ReservationStatus.CONFIRMED };
      mockReservationsService.confirmReservation.mockResolvedValue(confirmedReservation);

      const result = await controller.confirmReservation(reservationId);

      expect(service.confirmReservation).toHaveBeenCalledWith(reservationId);
      expect(result).toBe(confirmedReservation);
    });
  });

  describe('refuseReservation', () => {
    const reservationId = mockReservation._id.toString();

    it('should refuse a reservation successfully', async () => {
      const refusedReservation = { ...mockReservation, status: ReservationStatus.REFUSED };
      mockReservationsService.refuseReservation.mockResolvedValue(refusedReservation);

      const result = await controller.refuseReservation(reservationId);

      expect(service.refuseReservation).toHaveBeenCalledWith(reservationId);
      expect(result).toBe(refusedReservation);
    });
  });

  describe('adminCancelReservation', () => {
    const reservationId = mockReservation._id.toString();

    it('should admin cancel a reservation successfully', async () => {
      const canceledReservation = { ...mockReservation, status: ReservationStatus.CANCELED };
      mockReservationsService.adminCancelReservation.mockResolvedValue(canceledReservation);

      const result = await controller.adminCancelReservation(reservationId);

      expect(service.adminCancelReservation).toHaveBeenCalledWith(reservationId);
      expect(result).toBe(canceledReservation);
    });
  });
});
