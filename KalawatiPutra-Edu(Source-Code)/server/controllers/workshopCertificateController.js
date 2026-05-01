// const PDFDocument = require('pdfkit');
// const QRCode = require('qrcode');
// const WorkshopCertificate = require('../models/WorkshopCertificate');
// const Workshop = require('../models/Workshop');
// const User = require('../models/User');
// const axios = require('axios');

// const generateCertificateNumber = (username) => {
//   const prefix = (username.length >= 4 ? username.slice(0, 4) : username.padEnd(4, 'X')).toUpperCase();
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let randomPart = '';
//   for (let i = 0; i < 6; i++) {
//     randomPart += chars[Math.floor(Math.random() * chars.length)];
//   }
//   return prefix + randomPart;
// };

// exports.verifyWorkshopCode = async (req, res) => {
//   try {
//     const { code } = req.body;
//     const workshop = await Workshop.findOne({ code });
//     if (!workshop) {
//       return res.status(404).json({ message: 'Invalid workshop code' });
//     }
//     res.json({ valid: true, workshopId: workshop._id, title: workshop.title });
//   } catch (error) {
//     console.error('Error verifying workshop code:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.generateWorkshopCertificate = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { workshopId } = req.query;
    
//     const user = await User.findById(userId);
//     if (!user || !user.name) {
//       return res.status(404).json({ message: 'User not found or missing name' });
//     }

//     const workshop = await Workshop.findById(workshopId);
//     if (!workshop) {
//       return res.status(404).json({ message: 'Workshop not found' });
//     }

//     const certificateNumber = generateCertificateNumber(user.name);
//     const certificate = new WorkshopCertificate({
//       userId,
//       certificateNumber,
//       workshopId,
//       issueDate: new Date(),
//     });
//     await certificate.save();

//     const doc = new PDFDocument({
//       size: 'A4',
//       layout: 'landscape',
//       margin: 20,
//       info: {
//         Title: `Certificate of Completion - ${user.name}`,
//         Author: 'KalawatiPutra Edu',
//       },
//     });

//     const buffers = [];
//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('end', () => {
//       const pdfData = Buffer.concat(buffers);
//       res.set({
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `attachment; filename=workshop-certificate-${certificateNumber}.pdf`,
//       });
//       res.send(pdfData);
//     });

//     const width = doc.page.width;
//     const height = doc.page.height;
//     const contentPadding = 80;

//     doc
//       .rect(contentPadding - 10, contentPadding - 10, width - 2 * (contentPadding - 10), height - 2 * (contentPadding - 10))
//       .fill('#f8f9fa');

//     await addDecorationBorder(doc, width, height, contentPadding);

//     try {
//       const logoUrl = 'https://res.cloudinary.com/dyv8xdud5/image/upload/v1746265717/kalawatiputratutor/articles/logo.png';
//       const logoResponse = await axios.get(logoUrl, { responseType: 'arraybuffer' });
//       doc.image(logoResponse.data, contentPadding, contentPadding - 10, { width: 65 });
//     } catch (e) {
//       console.error('Failed to load logo image:', e.message);
//     }

//     try {
//       const ribbonUrl = 'https://res.cloudinary.com/dyv8xdud5/image/upload/v1747321522/certificate_details/dtfxexj0v381xlios5qe.png';
//       const ribbonResponse = await axios.get(ribbonUrl, { responseType: 'arraybuffer' });
//       doc.image(ribbonResponse.data, width - contentPadding - 60, contentPadding - 10, { width: 65 });
//     } catch (e) {
//       console.error('Failed to load ribbon image:', e.message);
//     }

//     doc.font('Times-Bold').fontSize(32).fillColor('#003087');
//     doc.text('CERTIFICATE OF COMPLETION', contentPadding, height / 5, {
//       align: 'center',
//       width: width - 2 * contentPadding,
//       characterSpacing: 1,
//     });

//     doc.font('Times-Roman').fontSize(14).fillColor('#2f2f2f');
//     doc.text('THIS IS TO CERTIFY THAT', contentPadding, height / 3.5, {
//       align: 'center',
//       width: width - 2 * contentPadding,
//       lineGap: 4,
//     });

//     doc.font('Times-Bold').fontSize(28).fillColor('#b8860b');
//     doc.text(user.name.toUpperCase(), contentPadding, height / 3, {
//       align: 'center',
//       width: width - 2 * contentPadding,
//       characterSpacing: 0.5,
//       lineGap: 8,
//     });

//     doc.font('Times-Roman').fontSize(16).fillColor('#2f2f2f');
//     doc.text(` has successfully attended the`, contentPadding, height / 2.3, {
//       align: 'center',
//       width: width - 2 * contentPadding,
//       lineGap: 6,
//     });
//     doc.font('Times-Bold').fontSize(18).fillColor('#2f2f2f');
//     doc.text(workshop.title, contentPadding, height / 2.1, {
//       align: 'center',
//       width: width - 2 * contentPadding,
//       lineGap: 6,
//     });
//     doc.font('Times-Roman').fontSize(16);
//     doc.text('organized by', contentPadding, height / 1.95, {
//       align: 'center',
//       width: width - 2 * contentPadding,
//     });

//     doc.font('Times-Bold').fontSize(30.5).fillColor('#003087');
//     doc.text('KalawatiPutra Edu', contentPadding, height / 1.8, {
//       align: 'center',
//       width: width - 2 * contentPadding,
//       characterSpacing: 0.5,
//     });

//     doc.font('Times-Roman').fontSize(10).fillColor('#555');
//     doc.text(`Certificate Number: ${certificateNumber}`, contentPadding, height - contentPadding - 50);
    
//     const formattedDate = new Date().toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//     doc.text(`Issue Date: ${formattedDate}`, contentPadding, height - contentPadding - 30);

//     try {
//       const qrUrl = `https://kalawatiputra.com/verify-certificate?number=${certificateNumber}`;
//       const qrCode = await QRCode.toDataURL(qrUrl);
//       const qrBuffer = Buffer.from(qrCode.split(',')[1], 'base64');
//       doc.image(qrBuffer, width - contentPadding - 70, height - contentPadding - 80, { width: 70 });
//       doc.fontSize(8).fillColor('#555');
//       doc.text('Scan to verify', width - contentPadding - 85, height - contentPadding - 5, {
//         align: 'center',
//         width: 100,
//       });
//     } catch (e) {
//       console.error('Failed to generate QR code:', e.message);
//     }

//     try {
//       const signatureUrl = 'https://res.cloudinary.com/dyv8xdud5/image/upload/v1747332673/certificate_details/oeoftvcynqbhtqvtpomi.png';
//       const signatureResponse = await axios.get(signatureUrl, { responseType: 'arraybuffer' });
//       const signatureY = height - contentPadding - 105;
//       doc.image(signatureResponse.data, width / 2 - 50, signatureY, { width: 100 });
//       doc.moveTo(width / 2 - 60, signatureY + 40).lineTo(width / 2 + 60, signatureY + 40).stroke('#2f2f2f');
//       doc.fontSize(10).fillColor('#2f2f2f');
//       doc.text('Authorized Signatory', width / 2 - 50, signatureY + 55, { align: 'center', width: 90 });
//       doc.fontSize(9).fillColor('#2f2f2f');
//       doc.text('Aniket Kumar, Founder', width / 2 - 50, signatureY + 70, { align: 'center', width: 90 });
//       doc.text('KalawatiPutra Edu', width / 2 - 50, signatureY + 85, { align: 'center', width: 90 });
//     } catch (e) {
//       console.error('Failed to load signature image:', e.message);
//     }

//     const footerY = height - contentPadding - 5;
//     doc.moveTo(contentPadding, footerY).lineTo(width - contentPadding, footerY).lineWidth(0.5).stroke('#555');
//     doc.fontSize(8).fillColor('#666');
//     doc.text('KalawatiPutra Edu © 2025 | All Rights Reserved', contentPadding, footerY + 5, {
//       align: 'center',
//       width: width - 2 * contentPadding,
//     });

//     doc.end();
//   } catch (error) {
//     console.error('Error generating workshop certificate:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// async function addDecorationBorder(doc, width, height, contentPadding) {
//   const outerOffset = 25;
//   const outerX = contentPadding - outerOffset;
//   const outerY = contentPadding - outerOffset;
//   const outerWidth = width - 2 * (contentPadding - outerOffset);
//   const outerHeight = height - 2 * (contentPadding - outerOffset);

//   // Blue gradient-style layered border (from dark to light)
//   const gradientColors = ['#001f3f', '#003f7f', '#005fbf', '#007fff', '#3399ff']; // Dark to light blue
//   let gradientPadding = 0;

//   for (let i = 0; i < gradientColors.length; i++) {
//     doc
//       .save()
//       .rect(
//         outerX + gradientPadding,
//         outerY + gradientPadding,
//         outerWidth - 2 * gradientPadding,
//         outerHeight - 2 * gradientPadding
//       )
//       .lineWidth(2)
//       .strokeColor(gradientColors[i])
//       .stroke()
//       .restore();
//     gradientPadding += 1.5; // Slight inward shift for next layer
//   }

//   // First inner golden border
//   doc
//     .rect(contentPadding - 15, contentPadding - 15, width - 2 * (contentPadding - 15), height - 2 * (contentPadding - 15))
//     .lineWidth(3)
//     .stroke('#b8860b');

//   // Second inner blue border
//   doc
//     .rect(contentPadding - 12, contentPadding - 12, width - 2 * (contentPadding - 12), height - 2 * (contentPadding - 12))
//     .lineWidth(1.5)
//     .stroke('#003087');
// }



