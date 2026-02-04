const PDFDocument = require('pdfkit');
const fs = require('fs');

console.log('🧪 Test de génération PDF...');

try {
  // Test simple de génération PDF
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const stream = fs.createWriteStream('test-ticket.pdf');
  
  doc.pipe(stream);
  
  // Contenu du ticket de test
  doc.fontSize(20).text('🎫 Ticket de Réservation - TEST', { align: 'center' });
  doc.moveDown();
  
  doc.fontSize(14).text('Nom de l\'événement: Événement Test');
  doc.text('Date: 25 décembre 2024');
  doc.text('Lieu: Salle de Test');
  doc.text('Participant: John Doe');
  doc.text('Email: john.doe@example.com');
  doc.text('Status: CONFIRMED');
  
  doc.moveDown();
  doc.fontSize(12).text('Merci pour votre réservation!', { align: 'center' });
  doc.text('Ce ticket a été généré pour test.', { align: 'center' });
  
  doc.end();
  
  stream.on('finish', () => {
    console.log('✅ PDF généré avec succès: test-ticket.pdf');
    console.log('📄 Vous pouvez ouvrir le fichier pour vérifier le contenu.');
  });
  
  stream.on('error', (err) => {
    console.error('❌ Erreur lors de la génération du PDF:', err);
  });
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
}