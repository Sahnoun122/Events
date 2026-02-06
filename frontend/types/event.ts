// Types pour les événements
export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELED = 'CANCELED',
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  status: EventStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}