import PDFDocument from 'pdfkit';

export const generateTripPDF = (trip) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            
            doc.fontSize(20).text('ORDRE DE MISSION', { align: 'center' });
            doc.moveDown();
            
            doc.fontSize(12).text(`Chauffeur: ${trip.driver.firstname} ${trip.driver.lastname}`);
            doc.text(`Camion: ${trip.truck.plateNumber}`);
            if (trip.trailer) {
                doc.text(`Remorque: ${trip.trailer.plateNumber}`);
            }
            doc.moveDown();
            
            doc.text(`Depart: ${trip.departure}`);
            doc.text(`Destination: ${trip.destination}`);
            doc.text(`Date: ${new Date(trip.departureDate).toLocaleDateString()}`);
            doc.moveDown();
            
            doc.text(`Statut: ${trip.status}`);
            
            if (trip.startMileage) {
                doc.text(`Kilometrage depart: ${trip.startMileage} km`);
            }
            
            if (trip.endMileage) {
                doc.text(`Kilometrage arrivee: ${trip.endMileage} km`);
            }
            
            if (trip.fuelUsed) {
                doc.text(`Gasoil utilise: ${trip.fuelUsed} L`);
            }
            
            if (trip.notes) {
                doc.moveDown();
                doc.text(`Notes: ${trip.notes}`);
            }
            
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};