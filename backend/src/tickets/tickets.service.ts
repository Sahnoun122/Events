import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ReservationsService } from '../reservations/reservations.service';
import { ReservationStatus } from 'src/common/enums/reservation-status.enum';
import PDFDocument from 'pdfkit';
import { ReservationDocument } from 'src/reservations/reservation.schema';

@Injectable()
export class TicketsService {
  constructor(private readonly reservationsService: ReservationsService) {}

  async generateTicketPDF(
    reservationId: string,
    userId: string,
  ): Promise<Buffer> {
    const reservation: ReservationDocument =
      await this.reservationsService.findOne(reservationId);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.participant.toString() !== userId.toString()) {
      throw new BadRequestException(
        'You are not authorized to download this ticket',
      );
    }

    if (reservation.status !== ReservationStatus.CONFIRMED) {
      throw new BadRequestException(
        'Ticket can only be downloaded for CONFIRMED reservations',
      );
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers: Uint8Array[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    doc.fontSize(20).text('Ticket de Réservation', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Nom de l'événement: ${(reservation.event as any).title}`);
    doc.text(
      `Date: ${new Date((reservation.event as any).date).toLocaleDateString('fr-FR')}`,
    );
    doc.text(`Lieu: ${(reservation.event as any).location}`);
    doc.text(`Participant: ${(reservation.participant as any).fullName}`);
    doc.text(`Email: ${(reservation.participant as any).email}`);
    doc.text(`Status: ${reservation.status}`);
    if (reservation.comment) {
      doc.text(`Commentaire: ${reservation.comment}`);
    }

    doc.moveDown();
    doc.fontSize(12).text('Merci pour votre réservation!', { align: 'center' });

    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: any[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    return pdfBuffer;
  }
}
