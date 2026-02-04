import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EventsService } from 'src/events/events.service';
import { Event } from 'src/events/event.schema';
import { EventStatus } from 'src/common/enums/event-status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;

  const mockEventModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: mockEventModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);

    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create event with status DRAFT', async () => {
      const dto = {
        title: 'React Workshop',
        description: 'Advanced React',
        date: '2026-02-10T10:00:00.000Z',
        location: 'Casablanca',
        capacity: 30,
      };

      const createdEvent = {
        ...dto,
        date: new Date(dto.date),
        status: EventStatus.DRAFT,
      };

      mockEventModel.create.mockResolvedValue(createdEvent);

      const result = await service.create(dto as any);

      expect(mockEventModel.create).toHaveBeenCalledWith({
        ...dto,
        date: new Date(dto.date),
        status: EventStatus.DRAFT,
      });

      expect(result.status).toBe(EventStatus.DRAFT);
      expect(result.title).toBe(dto.title);
    });
  });

  describe('findAllPublic()', () => {
    it('should return only published events', async () => {
      const events = [
        { title: 'Event 1', status: EventStatus.PUBLISHED },
        { title: 'Event 2', status: EventStatus.PUBLISHED },
      ];

      mockEventModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(events),
      });

      const result = await service.findAllPublic();

      expect(mockEventModel.find).toHaveBeenCalledWith({
        status: EventStatus.PUBLISHED,
      });

      expect(result.length).toBe(2);
      expect(result[0].status).toBe(EventStatus.PUBLISHED);
    });
  });

  describe('findById()', () => {
    it('should return event if exists', async () => {
      const event = { _id: '123', title: 'Event test' };

      mockEventModel.findById.mockResolvedValue(event);

      const result = await service.findById('123');

      expect(mockEventModel.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(event);
    });

    it('should throw NotFoundException if event not found', async () => {
      mockEventModel.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update event if status is not canceled', async () => {
      const event = {
        _id: '123',
        title: 'Old Title',
        status: EventStatus.DRAFT,
        save: jest.fn().mockResolvedValue({
          title: 'New Title',
          status: EventStatus.DRAFT,
        }),
      };

      jest.spyOn(service, 'findById').mockResolvedValue(event as any);

      const result = await service.update('123', { title: 'New Title' } as any);

      expect(event.save).toHaveBeenCalled();
      expect(result.title).toBe('New Title');
    });

    it('should throw BadRequestException if event is canceled', async () => {
      const event = {
        _id: '123',
        status: EventStatus.CANCELED,
      };

      jest.spyOn(service, 'findById').mockResolvedValue(event as any);

      await expect(
        service.update('123', { title: 'New Title' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('publish()', () => {
    it('should publish event if not canceled', async () => {
      const event = {
        _id: '123',
        status: EventStatus.DRAFT,
        save: jest.fn().mockResolvedValue({
          status: EventStatus.PUBLISHED,
        }),
      };

      jest.spyOn(service, 'findById').mockResolvedValue(event as any);

      const result = await service.publish('123');

      expect(event.status).toBe(EventStatus.PUBLISHED);
      expect(event.save).toHaveBeenCalled();
      expect(result.status).toBe(EventStatus.PUBLISHED);
    });

    it('should throw BadRequestException if event is canceled', async () => {
      const event = {
        _id: '123',
        status: EventStatus.CANCELED,
      };

      jest.spyOn(service, 'findById').mockResolvedValue(event as any);

      await expect(service.publish('123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancel()', () => {
    it('should cancel event', async () => {
      const event = {
        _id: '123',
        status: EventStatus.PUBLISHED,
        save: jest.fn().mockResolvedValue({
          status: EventStatus.CANCELED,
        }),
      };

      jest.spyOn(service, 'findById').mockResolvedValue(event as any);

      const result = await service.cancel('123');

      expect(event.status).toBe(EventStatus.CANCELED);
      expect(event.save).toHaveBeenCalled();
      expect(result.status).toBe(EventStatus.CANCELED);
    });
  });

  describe('remove()', () => {
    it('should delete event', async () => {
      const event = {
        _id: '123',
        deleteOne: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(service, 'findById').mockResolvedValue(event as any);

      const result = await service.remove('123');

      expect(event.deleteOne).toHaveBeenCalled();
      expect(result.message).toBe('Event deleted successfully');
    });
  });
});
