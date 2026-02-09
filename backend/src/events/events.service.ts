import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './event.schema';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventStatus } from '../common/enums/event-status.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private eventModel: Model<EventDocument>,
  ) {}

  async create(dto: CreateEventDto) {
    const event = await this.eventModel.create({
      ...dto,
      date: new Date(dto.date),
      status: dto.status || EventStatus.DRAFT,
    });

    return event;
  }

  async findAllPublic() {
    return this.eventModel
      .find({ status: EventStatus.PUBLISHED })
      .sort({ date: 1 });
  }

  async findAllAdmin() {
    return this.eventModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, dto: UpdateEventDto) {
    const event = await this.findById(id);

    if (event.status === EventStatus.CANCELED) {
      throw new BadRequestException('Cannot update a canceled event');
    }

    Object.assign(event, dto);

    if (dto.date) {
      event.date = new Date(dto.date);
    }

    return event.save();
  }

  async publish(id: string) {
    const event = await this.findById(id);

    if (event.status === EventStatus.CANCELED) {
      throw new BadRequestException('Cannot publish a canceled event');
    }

    event.status = EventStatus.PUBLISHED;
    return event.save();
  }

  async cancel(id: string) {
    const event = await this.findById(id);
    event.status = EventStatus.CANCELED;
    return event.save();
  }

  async remove(id: string) {
    const event = await this.findById(id);
    await event.deleteOne();
    return { message: 'Event deleted successfully' };
  }

  async getEventStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalEvents = await this.eventModel.countDocuments();
    const publishedEvents = await this.eventModel.countDocuments({ 
      status: EventStatus.PUBLISHED 
    });
    const upcomingEvents = await this.eventModel.countDocuments({ 
      status: EventStatus.PUBLISHED,
      date: { $gte: today }
    });
    const pastEvents = await this.eventModel.countDocuments({ 
      status: EventStatus.PUBLISHED,
      date: { $lt: today }
    });
    const draftEvents = await this.eventModel.countDocuments({ 
      status: EventStatus.DRAFT 
    });
    const canceledEvents = await this.eventModel.countDocuments({ 
      status: EventStatus.CANCELED 
    });

    const upcomingEventsData = await this.eventModel
      .find({ 
        status: EventStatus.PUBLISHED,
        date: { $gte: today }
      })
      .sort({ date: 1 })
      .limit(5)
      .select('title date location capacity');

    return {
      totalEvents,
      publishedEvents,
      upcomingEvents,
      pastEvents,
      draftEvents,
      canceledEvents,
      upcomingEventsData
    };
  }
}
