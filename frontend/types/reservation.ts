export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  REFUSED = 'REFUSED'
}

export interface Reservation {
  _id: string;
  event: {
    _id: string;
    title: string;
    date: Date;
    location: string;
    capacity: number;
    category?: string;
  };
  participant: {
    _id: string;
    fullName: string;
    email: string;
  };
  status: ReservationStatus;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationDto {
  comment?: string;
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
  refused: number;
  upcomingEvents: number;
  averageFillRate: number;
}