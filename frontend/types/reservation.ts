export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export interface Reservation {
  _id: string;
  event: {
    _id: string;
    title: string;
    date: Date;
    location: string;
    capacity: number;
  };
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  status: ReservationStatus;
  reservationDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationDto {
  eventId: string;
  notes?: string;
}

export interface UpdateReservationDto {
  status: ReservationStatus;
  notes?: string;
}

export interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  rejected: number;
  upcomingEvents: number;
  averageFillRate: number;
}