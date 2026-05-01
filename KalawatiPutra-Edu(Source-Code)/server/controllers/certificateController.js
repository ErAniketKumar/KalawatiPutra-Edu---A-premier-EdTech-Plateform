// const PDFDocument = require("pdfkit");
// const QRCode = require("qrcode");
// const Certificate = require("../models/Certificate");
// const User = require("../models/User");
// const axios = require("axios");

// const generateCertificateNumber = (username) => {
// 	const prefix = (
// 		username.length >= 4 ? username.slice(0, 4) : username.padEnd(4, "X")
// 	).toUpperCase();
// 	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
// 	let randomPart = "";
// 	for (let i = 0; i < 6; i++) {
// 		randomPart += chars[Math.floor(Math.random() * chars.length)];
// 	}
// 	return prefix + randomPart;
// };

// exports.generateCertificate = async (req, res) => {
// 	try {
// 		const userId = req.user.userId;
// 		console.log("userId from JWT:", userId);
// 		const user = await User.findById(userId);
// 		if (!user || !user.name) {
// 			return res
// 				.status(404)
// 				.json({ message: "User not found or missing name" });
// 		}

// 		const certificateNumber = generateCertificateNumber(user.name);
// 		const certificate = new Certificate({
// 			userId,
// 			certificateNumber,
// 			issueDate: new Date(),
// 		});
// 		await certificate.save();

// 		// Create a landscape PDF with adjusted margins
// 		const doc = new PDFDocument({
// 			size: "A4",
// 			layout: "landscape",
// 			margin: 20,
// 			info: {
// 				Title: `Certificate of Achievement - ${user.name}`,
// 				Author: "KalawatiPutra Edu",
// 			},
// 		});

// 		const buffers = [];
// 		doc.on("data", buffers.push.bind(buffers));
// 		doc.on("end", () => {
// 			const pdfData = Buffer.concat(buffers);
// 			res.set({
// 				"Content-Type": "application/pdf",
// 				"Content-Disposition": `attachment; filename=certificate-${certificateNumber}.pdf`,
// 			});
// 			res.send(pdfData);
// 		});

// 		// Document dimensions
// 		const width = doc.page.width; // 841.89
// 		const height = doc.page.height; // 595.28
// 		const contentPadding = 80;

// 		// Add subtle background
// 		doc
// 			.rect(
// 				contentPadding - 10,
// 				contentPadding - 10,
// 				width - 2 * (contentPadding - 10),
// 				height - 2 * (contentPadding - 10)
// 			)
// 			.fill("#f8f9fa");

// 		// Add decorative border
// 		await addDecorationBorder(doc, width, height, contentPadding);

// 		// Add logo with proper spacing (moved down 8px from border)
// 		try {
// 			const logoUrl =
// 				"https://res.cloudinary.com/dyv8xdud5/image/upload/v1746265717/kalawatiputratutor/articles/logo.png";
// 			const logoResponse = await axios.get(logoUrl, {
// 				responseType: "arraybuffer",
// 			});
// 			doc.image(logoResponse.data, contentPadding, contentPadding - 10, {
// 				width: 65,
// 			}); // Adjusted y-position
// 		} catch (e) {
// 			console.error("Failed to load logo image:", e.message);
// 		}

// 		// Add gold ribbon
// 		try {
// 			const ribbonUrl =
// 				"https://res.cloudinary.com/dyv8xdud5/image/upload/v1747321522/certificate_details/dtfxexj0v381xlios5qe.png";
// 			const ribbonResponse = await axios.get(ribbonUrl, {
// 				responseType: "arraybuffer",
// 			});
// 			doc.image(
// 				ribbonResponse.data,
// 				width - contentPadding - 60,
// 				contentPadding - 10,
// 				{ width: 65 }
// 			); // Adjusted y-position
// 		} catch (e) {
// 			console.error("Failed to load ribbon image:", e.message);
// 		}

// 		// Certificate title with improved styling
// 		doc.font("Times-Bold");
// 		doc.fontSize(32).fillColor("#003087"); // Increased font size
// 		doc.text("CERTIFICATE OF ACHIEVEMENT", contentPadding, height / 5, {
// 			align: "center",
// 			width: width - 2 * contentPadding,
// 			characterSpacing: 1, // Added letter spacing
// 		});

// 		// Certificate body with improved spacing
// 		doc.font("Times-Roman");
// 		doc.fontSize(14).fillColor("#2f2f2f"); // Increased font size
// 		doc.text(" THIS IS TO CERTIFY THAT", contentPadding, height / 3.5, {
// 			align: "center",
// 			width: width - 2 * contentPadding,
// 			lineGap: 4, // Added line spacing
// 		});

// 		// Recipient name with enhanced styling
// 		doc.font("Times-Bold");
// 		doc.fontSize(28).fillColor("#b8860b"); // Increased font size
// 		doc.text(user.name.toUpperCase(), contentPadding, height / 3, {
// 			align: "center",
// 			width: width - 2 * contentPadding,
// 			characterSpacing: 0.5,
// 			lineGap: 8,
// 		});

// 		// Achievement details with improved typography
// 		doc.font("Times-Roman");
// 		doc.fontSize(14).fillColor("#2f2f2f"); // Increased font size
// 		doc.text(
// 			"has successfully solved 100+ Data Structures and Algorithms problems",
// 			contentPadding,
// 			height / 2.3,
// 			{
// 				align: "center",
// 				width: width - 2 * contentPadding,
// 				lineGap: 6,
// 			}
// 		);
// 		doc.text(
// 			"demonstrating exceptional problem-solving skills and algorithmic thinking",
// 			contentPadding,
// 			height / 2.1,
// 			{
// 				align: "center",
// 				width: width - 2 * contentPadding,
// 				lineGap: 6,
// 			}
// 		);
// 		doc.text("on", contentPadding, height / 1.95, {
// 			align: "center",
// 			width: width - 2 * contentPadding,
// 		});

// 		// Organization name with improved styling
// 		doc.font("Times-Bold");
// 		doc.fontSize(30.5).fillColor("#003087"); // Increased by ~7.5 points (≈10px)
// 		doc.text("KalawatiPutra Edu", contentPadding, height / 1.8, {
// 			align: "center",
// 			width: width - 2 * contentPadding,
// 			characterSpacing: 0.5,
// 		});

// 		// Certificate number and date with better positioning
// 		doc.font("Times-Roman");
// 		doc.fontSize(10).fillColor("#555");
// 		doc.text(
// 			`Certificate Number: ${certificateNumber}`,
// 			contentPadding,
// 			height - contentPadding - 50
// 		); // Moved up

// 		// Issue date
// 		const formattedDate = new Date().toLocaleDateString("en-US", {
// 			year: "numeric",
// 			month: "long",
// 			day: "numeric",
// 		});
// 		doc.text(
// 			`Issue Date: ${formattedDate}`,
// 			contentPadding,
// 			height - contentPadding - 30
// 		); // Moved up

// 		// Add QR code with better positioning
// 		try {
// 			const qrUrl = `https://kalawatiputra.com/verify-certificate?number=${certificateNumber}`;
// 			const qrCode = await QRCode.toDataURL(qrUrl);
// 			const qrBuffer = Buffer.from(qrCode.split(",")[1], "base64");
// 			doc.image(
// 				qrBuffer,
// 				width - contentPadding - 70,
// 				height - contentPadding - 80,
// 				{ width: 70 }
// 			); // Moved up
// 			doc.fontSize(8).fillColor("#555");
// 			doc.text(
// 				"Scan to verify",
// 				width - contentPadding - 85,
// 				height - contentPadding - 5,
// 				{
// 					// Moved up
// 					align: "center",
// 					width: 100,
// 				}
// 			);
// 		} catch (e) {
// 			console.error("Failed to generate QR code:", e.message);
// 		}

// 		// Add signature with better positioning and styling
// 		try {
// 			const signatureUrl =
// 				"https://res.cloudinary.com/dyv8xdud5/image/upload/v1747332673/certificate_details/oeoftvcynqbhtqvtpomi.png";
// 			const signatureResponse = await axios.get(signatureUrl, {
// 				responseType: "arraybuffer",
// 			});

// 			const signatureY = height - contentPadding - 105;
// 			doc.image(signatureResponse.data, width / 2 - 50, signatureY, {
// 				width: 100,
// 			});

// 			// Signature line
// 			doc
// 				.moveTo(width / 2 - 60, signatureY + 40)
// 				.lineTo(width / 2 + 60, signatureY + 40)
// 				.stroke("#2f2f2f");

// 			// Signature text
// 			doc.fontSize(10).fillColor("#2f2f2f");
// 			doc.text("Authorized Signatory", width / 2 - 50, signatureY + 55, {
// 				align: "center",
// 				width: 90,
// 			});
// 			doc.fontSize(9).fillColor("#2f2f2f");
// 			doc.text("Aniket Kumar, Founder", width / 2 - 50, signatureY + 70, {
// 				align: "center",
// 				width: 90,
// 			});
// 			doc.text("KalawatiPutra Edu", width / 2 - 50, signatureY + 85, {
// 				align: "center",
// 				width: 90,
// 			});
// 		} catch (e) {
// 			console.error("Failed to load signature image:", e.message);
// 		}

// 		// Final footer position (moved up additional 10px)
// 		const footerY = height - contentPadding - 5; // Now -15 (was -5)
// 		doc
// 			.moveTo(contentPadding, footerY)
// 			.lineTo(width - contentPadding, footerY)
// 			.lineWidth(0.5)
// 			.stroke("#555");
// 		doc.fontSize(8).fillColor("#666");
// 		doc.text(
// 			"KalawatiPutra Edu © 2025 | All Rights Reserved",
// 			contentPadding,
// 			footerY + 5,
// 			{
// 				align: "center",
// 				width: width - 2 * contentPadding,
// 			}
// 		);

// 		doc.end();
// 	} catch (error) {
// 		console.error("Error generating certificate:", error);
// 		res.status(500).json({ message: "Server error" });
// 	}
// };

// // Improved decorative border function
// // async function addDecorationBorder(doc, width, height, contentPadding) {
// // 	// Double border with improved styling
// // 	doc
// // 		.rect(
// // 			contentPadding - 15,
// // 			contentPadding - 15,
// // 			width - 2 * (contentPadding - 15),
// // 			height - 2 * (contentPadding - 15)
// // 		)
// // 		.lineWidth(3)
// // 		.stroke("#b8860b");
// // 	doc
// // 		.rect(
// // 			contentPadding - 12,
// // 			contentPadding - 12,
// // 			width - 2 * (contentPadding - 12),
// // 			height - 2 * (contentPadding - 12)
// // 		)
// // 		.lineWidth(1.5)
// // 		.stroke("#003087");

// 	// Add corner decorations
// 	//  try {
// 	//    const cornerUrl = 'https://res.cloudinary.com/dyv8xdud5/image/upload/v1747321522/certificate_details/xutzn6a2dim2k1u5x1an.png';
// 	//    const cornerResponse = await axios.get(cornerUrl, { responseType: 'arraybuffer' });
// 	//    const cornerSize = 100;
// 	//
// 	//    // Top-left (with adjusted position)
// 	//    doc.image(cornerResponse.data, contentPadding - 18, contentPadding - 18, { width: cornerSize });
// 	//
// 	//    // Top-right
// 	//    doc.save();
// 	//    doc.translate(width - contentPadding + 18, contentPadding - 18);
// 	//    doc.rotate(90);
// 	//    doc.image(cornerResponse.data, 0, -cornerSize, { width: cornerSize });
// 	//    doc.restore();
// 	//
// 	//    // Bottom-right
// 	//    doc.save();
// 	//    doc.translate(width - contentPadding + 18, height - contentPadding + 18);
// 	//    doc.rotate(180);
// 	//    doc.image(cornerResponse.data, -cornerSize, -cornerSize, { width: cornerSize });
// 	//    doc.restore();
// 	//
// 	//    // Bottom-left
// 	//    doc.save();
// 	//    doc.translate(contentPadding - 18, height - contentPadding + 18);
// 	//    doc.rotate(270);
// 	//    doc.image(cornerResponse.data, -cornerSize, 0, { width: cornerSize });
// 	//    doc.restore();
// 	//  } catch (e) {
// 	//    console.error('Failed to add corner decorations:', e.message);
// 	//    drawFallbackCornerDecorations(doc, width, height, contentPadding);
// 	//  }
// //}

// // Enhanced fallback corner decorations
// // function drawFallbackCornerDecorations(doc, width, height, contentPadding) {
// // 	const cornerSize = 18;
// // 	const goldenColor = "#b8860b";
// // 	const lineWidth = 2.5;

// // 	// Top-left
// // 	doc
// // 		.lineWidth(lineWidth)
// // 		.moveTo(contentPadding - 12, contentPadding + cornerSize)
// // 		.lineTo(contentPadding - 12, contentPadding - 12)
// // 		.lineTo(contentPadding + cornerSize, contentPadding - 12)
// // 		.stroke(goldenColor);

// // 	// Top-right
// // 	doc
// // 		.lineWidth(lineWidth)
// // 		.moveTo(width - contentPadding + 12, contentPadding + cornerSize)
// // 		.lineTo(width - contentPadding + 12, contentPadding - 12)
// // 		.lineTo(width - contentPadding - cornerSize, contentPadding - 12)
// // 		.stroke(goldenColor);

// // 	// Bottom-right
// // 	doc
// // 		.lineWidth(lineWidth)
// // 		.moveTo(width - contentPadding + 12, height - contentPadding - cornerSize)
// // 		.lineTo(width - contentPadding + 12, height - contentPadding + 12)
// // 		.lineTo(width - contentPadding - cornerSize, height - contentPadding + 12)
// // 		.stroke(goldenColor);

// // 	// Bottom-left
// // 	doc
// // 		.lineWidth(lineWidth)
// // 		.moveTo(contentPadding - 12, height - contentPadding - cornerSize)
// // 		.lineTo(contentPadding - 12, height - contentPadding + 12)
// // 		.lineTo(contentPadding + cornerSize, height - contentPadding + 12)
// // 		.stroke(goldenColor);
// // }

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
// 	doc
// 	  .save()
// 	  .rect(
// 		outerX + gradientPadding,
// 		outerY + gradientPadding,
// 		outerWidth - 2 * gradientPadding,
// 		outerHeight - 2 * gradientPadding
// 	  )
// 	  .lineWidth(2)
// 	  .strokeColor(gradientColors[i])
// 	  .stroke()
// 	  .restore();
// 	gradientPadding += 1.5; // Slight inward shift for next layer
//   }

//   // First inner golden border
//   doc
// 	.rect(contentPadding - 15, contentPadding - 15, width - 2 * (contentPadding - 15), height - 2 * (contentPadding - 15))
// 	.lineWidth(3)
// 	.stroke('#b8860b');

//   // Second inner blue border
//   doc
// 	.rect(contentPadding - 12, contentPadding - 12, width - 2 * (contentPadding - 12), height - 2 * (contentPadding - 12))
// 	.lineWidth(1.5)
// 	.stroke('#003087');
// }

// exports.verifyCertificate = async (req, res) => {
// 	try {
// 		const { certificateNumber } = req.body;
// 		const certificate = await Certificate.findOne({
// 			certificateNumber,
// 		}).populate("userId", "name");
// 		if (!certificate) {
// 			return res.status(404).json({ message: "Certificate not found" });
// 		}
// 		res.json({
// 			valid: true,
// 			userName: certificate.userId.name,
// 			issueDate: certificate.issueDate,
// 			certificateNumber,
// 		});
// 	} catch (error) {
// 		console.error("Error verifying certificate:", error);
// 		res.status(500).json({ message: "Server error" });
// 	}
// };







const express = require('express');
// const router = express.Router();
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Workshop = require('../models/Workshop');
const axios = require('axios');
const auth = require('../middleware/auth');

// Generate unique certificate number
const generateCertificateNumber = (username) => {
  const prefix = (username.length >= 4 ? username.slice(0, 4) : username.padEnd(4, 'X')).toUpperCase();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars[Math.floor(Math.random() * chars.length)];
  }
  return prefix + randomPart;
};

// Add decorative border to PDF
async function addDecorationBorder(doc, width, height, contentPadding) {
  const outerOffset = 25;
  const outerX = contentPadding - outerOffset;
  const outerY = contentPadding - outerOffset;
  const outerWidth = width - 2 * (contentPadding - outerOffset);
  const outerHeight = height - 2 * (contentPadding - outerOffset);

  // Blue gradient-style layered border (from dark to light)
  const gradientColors = ['#001f3f', '#003f7f', '#005fbf', '#007fff', '#3399ff'];
  let gradientPadding = 0;

  for (let i = 0; i < gradientColors.length; i++) {
    doc
      .save()
      .rect(
        outerX + gradientPadding,
        outerY + gradientPadding,
        outerWidth - 2 * gradientPadding,
        outerHeight - 2 * gradientPadding
      )
      .lineWidth(2)
      .strokeColor(gradientColors[i])
      .stroke()
      .restore();
    gradientPadding += 1.5;
  }

  // First inner golden border
  doc
    .rect(contentPadding - 15, contentPadding - 15, width - 2 * (contentPadding - 15), height - 2 * (contentPadding - 15))
    .lineWidth(3)
    .stroke('#b8860b');

  // Second inner blue border
  doc
    .rect(contentPadding - 12, contentPadding - 12, width - 2 * (contentPadding - 12), height - 2 * (contentPadding - 12))
    .lineWidth(1.5)
    .stroke('#003087');
}

// Generate certificate (DSA, Welcome, or Workshop)
const generateCertificate = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, workshopId } = req.query;

    // Validate certificate type
    if (!['DSA', 'Welcome', 'Workshop'].includes(type)) {
      return res.status(400).json({ message: 'Invalid certificate type. Must be DSA, Welcome, or Workshop' });
    }

    const user = await User.findById(userId);
    if (!user || !user.name) {
      return res.status(404).json({ message: 'User not found or missing name' });
    }

    // Validate workshopId for Workshop type
    let workshop;
    if (type === 'Workshop') {
      if (!workshopId) {
        return res.status(400).json({ message: 'workshopId is required for Workshop certificate' });
      }
      workshop = await Workshop.findById(workshopId);
      if (!workshop) {
        return res.status(404).json({ message: 'Workshop not found' });
      }
    }

    const certificateNumber = generateCertificateNumber(user.name);
    const certificateData = {
      userId,
      certificateNumber,
      issueDate: new Date(),
      type,
    };
    if (type === 'Workshop') {
      certificateData.workshopId = workshopId;
    }
    const certificate = new Certificate(certificateData);
    await certificate.save();

    // Create PDF
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 20,
      info: {
        Title: `${type === 'Welcome' ? 'Welcome' : type === 'Workshop' ? 'Certificate of Completion' : 'Certificate of Achievement'} - ${user.name}`,
        Author: 'KalawatiPutra Edu',
      },
    });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${type.toLowerCase()}-certificate-${certificateNumber}.pdf`,
      });
      res.send(pdfData);
    });

    const width = doc.page.width;
    const height = doc.page.height;
    const contentPadding = 80;

    // Background
    doc
      .rect(contentPadding - 10, contentPadding - 10, width - 2 * (contentPadding - 10), height - 2 * (contentPadding - 10))
      .fill('#f8f9fa');

    // Decorative border
    await addDecorationBorder(doc, width, height, contentPadding);

    // Logo
    try {
      const logoUrl = 'https://res.cloudinary.com/dyv8xdud5/image/upload/v1748794501/certificate_details/tpb2hbjn2xdvlte9jvu8.png';
      const logoResponse = await axios.get(logoUrl, { responseType: 'arraybuffer' });
      doc.image(logoResponse.data, contentPadding, contentPadding - 10, { width: 65 });
    } catch (e) {
      console.error('Failed to load logo image:', e.message);
    }

    // Ribbon
    try {
      const ribbonUrl = 'https://res.cloudinary.com/dyv8xdud5/image/upload/v1747321522/certificate_details/dtfxexj0v381xlios5qe.png';
      const ribbonResponse = await axios.get(ribbonUrl, { responseType: 'arraybuffer' });
      doc.image(ribbonResponse.data, width - contentPadding - 60, contentPadding - 10, { width: 65 });
    } catch (e) {
      console.error('Failed to load ribbon image:', e.message);
    }

    // Title
    doc.font('Times-Bold').fontSize(32).fillColor('#003087');
    const title = type === 'Welcome' ? 'WELCOME CERTIFICATE' : type === 'Workshop' ? 'CERTIFICATE OF COMPLETION' : 'CERTIFICATE OF ACHIEVEMENT';
    doc.text(title, contentPadding, height / 5, {
      align: 'center',
      width: width - 2 * contentPadding,
      characterSpacing: 1,
    });

    // Certify text
    doc.font('Times-Roman').fontSize(14).fillColor('#2f2f2f');
    doc.text('THIS IS TO CERTIFY THAT', contentPadding, height / 3.5, {
      align: 'center',
      width: width - 2 * contentPadding,
      lineGap: 4,
    });

    // User name
    doc.font('Times-Bold').fontSize(28).fillColor('#b8860b');
    doc.text(user.name.toUpperCase(), contentPadding, height / 3, {
      align: 'center',
      width: width - 2 * contentPadding,
      characterSpacing: 0.5,
      lineGap: 8,
    });

    // Certificate-specific content
    doc.font('Times-Roman').fillColor('#2f2f2f');
    if (type === 'DSA') {
      doc.fontSize(14);
      doc.text('has successfully solved 100+ Data Structures and Algorithms problems', contentPadding, height / 2.3, {
        align: 'center',
        width: width - 2 * contentPadding,
        lineGap: 6,
      });
      doc.text('demonstrating exceptional problem-solving skills and algorithmic thinking', contentPadding, height / 2.1, {
        align: 'center',
        width: width - 2 * contentPadding,
        lineGap: 6,
      });
      doc.text('on', contentPadding, height / 1.95, {
        align: 'center',
        width: width - 2 * contentPadding,
      });
    } else if (type === 'Welcome') {
      doc.fontSize(16);
      doc.text('has joined the KalawatiPutra Edu community', contentPadding, height / 2.3, {
        align: 'center',
        width: width - 2 * contentPadding,
        lineGap: 6,
      });
      doc.font('Times-Bold').fontSize(18);
      doc.text('as a valued member of our startup journey', contentPadding, height / 2.1, {
        align: 'center',
        width: width - 2 * contentPadding,
        lineGap: 6,
      });
      doc.font('Times-Roman').fontSize(16);
      doc.text('organized by', contentPadding, height / 1.95, {
        align: 'center',
        width: width - 2 * contentPadding,
      });
    } else if (type === 'Workshop') {
      doc.fontSize(16);
      doc.text('has successfully attended the', contentPadding, height / 2.3, {
        align: 'center',
        width: width - 2 * contentPadding,
        lineGap: 6,
      });
      doc.font('Times-Bold').fontSize(18);
      doc.text(workshop.title, contentPadding, height / 2.1, {
        align: 'center',
        width: width - 2 * contentPadding,
        lineGap: 6,
      });
      doc.font('Times-Roman').fontSize(16);
      doc.text('organized by', contentPadding, height / 1.95, {
        align: 'center',
        width: width - 2 * contentPadding,
      });
    }

    // Organization name
    doc.font('Times-Bold').fontSize(30.5).fillColor('#003087');
    doc.text('KalawatiPutra Edu', contentPadding, height / 1.8, {
      align: 'center',
      width: width - 2 * contentPadding,
      characterSpacing: 0.5,
    });

    // Certificate number
    doc.font('Times-Roman').fontSize(10).fillColor('#555');
    doc.text(`Certificate Number: ${certificateNumber}`, contentPadding, height - contentPadding - 50);

    // Issue date
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(`Issue Date: ${formattedDate}`, contentPadding, height - contentPadding - 30);

    // QR code
    try {
      const qrUrl = `https://kalawatiputra.com/verify-certificate?number=${certificateNumber}`;
      const qrCode = await QRCode.toDataURL(qrUrl);
      const qrBuffer = Buffer.from(qrCode.split(',')[1], 'base64');
      doc.image(qrBuffer, width - contentPadding - 70, height - contentPadding - 80, { width: 70 });
      doc.fontSize(8).fillColor('#555');
      doc.text('Scan to verify', width - contentPadding - 85, height - contentPadding - 5, {
        align: 'center',
        width: 100,
      });
    } catch (e) {
      console.error('Failed to generate QR code:', e.message);
    }

    // Signature
    try {
      const signatureUrl = 'https://res.cloudinary.com/dyv8xdud5/image/upload/v1747332673/certificate_details/oeoftvcynqbhtqvtpomi.png';
      const signatureResponse = await axios.get(signatureUrl, { responseType: 'arraybuffer' });
      const signatureY = height - contentPadding - 105;
      doc.image(signatureResponse.data, width / 2 - 50, signatureY, { width: 100 });
      doc.moveTo(width / 2 - 60, signatureY + 40).lineTo(width / 2 + 60, signatureY + 40).stroke('#2f2f2f');
      doc.fontSize(10).fillColor('#2f2f2f');
      doc.text('Authorized Signatory', width / 2 - 50, signatureY + 55, { align: 'center', width: 90 });
      doc.fontSize(9).fillColor('#2f2f2f');
      doc.text('Aniket Kumar, Founder', width / 2 - 50, signatureY + 70, { align: 'center', width: 90 });
      doc.text('KalawatiPutra Edu', width / 2 - 50, signatureY + 85, { align: 'center', width: 90 });
    } catch (e) {
      console.error('Failed to load signature image:', e.message);
    }

    // Footer
    const footerY = height - contentPadding - 5;
    doc.moveTo(contentPadding, footerY).lineTo(width - contentPadding, footerY).lineWidth(0.5).stroke('#555');
    doc.fontSize(8).fillColor('#666');
    doc.text('KalawatiPutra Edu © 2025 | All Rights Reserved', contentPadding, footerY + 5, {
      align: 'center',
      width: width - 2 * contentPadding,
    });

    doc.end();
  } catch (error) {
    console.error(`Error generating ${req.query.type} certificate:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify certificate (common for all types)
const verifyCertificate = async (req, res) => {
  try {
    const { certificateNumber } = req.body;
    const certificate = await Certificate.findOne({ certificateNumber }).populate('userId', 'name');
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json({
      valid: true,
      userName: certificate.userId.name,
      issueDate: certificate.issueDate,
      certificateNumber,
    });
  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify workshop code
const verifyWorkshopCode = async (req, res) => {
  try {
    const { code } = req.body;
    const workshop = await Workshop.findOne({ code });
    if (!workshop) {
      return res.status(404).json({ message: 'Invalid workshop code' });
    }
    res.json({ valid: true, workshopId: workshop._id, title: workshop.title });
  } catch (error) {
    console.error('Error verifying workshop code:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  generateCertificate,
  verifyCertificate,
  verifyWorkshopCode
};