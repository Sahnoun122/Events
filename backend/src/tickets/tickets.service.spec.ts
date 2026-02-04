import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { ReservationsService } from '../reservations/reservations.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ReservationStatus } from '../common/enums/reservation-status.enum';

const mockReservation = {
  _id: '507f1f77bcf86cd799439011',
  participant: '507f1f77bcf86cd799439012', // ObjectId as string
  event: {
    title: 'Test Event',
    date: new Date('2024-12-25'),
    location: 'Test Location',
    capacity: 100,
  },
  status: ReservationStatus.CONFIRMED,
  comment: 'Test comment',
  toString: () => '507f1f77bcf86cd799439011',
};

const mockReservationsService = {
  findOne: jest.fn(),
};

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTicketPDF', () => {
    it('should generate PDF for confirmed reservation', async () => {
      mockReservationsService.findOne.mockResolvedValue(mockReservation);

      const result = await service.generateTicketPDF('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012');

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
      expect(mockReservationsService.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if reservation not found', async () => {
      mockReservationsService.findOne.mockResolvedValue(null);

      await expect(
        service.generateTicketPDF('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user not authorized', async () => {
      mockReservationsService.findOne.mockResolvedValue(mockReservation);

      await expect(
        service.generateTicketPDF('507f1f77bcf86cd799439011', 'wronguserid')
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if reservation not confirmed', async () => {
      const pendingReservation = {
        ...mockReservation,
        status: ReservationStatus.PENDING,
      };
      mockReservationsService.findOne.mockResolvedValue(pendingReservation);

      await expect(
        service.generateTicketPDF('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012')
      ).rejects.toThrow(BadRequestException);
    });
  });
});
