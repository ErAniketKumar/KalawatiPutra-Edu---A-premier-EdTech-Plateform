// const mongoose = require('mongoose');

// const workshopCertificateSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   certificateNumber: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   issueDate: {
//     type: Date,
//     default: Date.now,
//   },
//   workshopId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Workshop',
//     required: true,
//   },
// });

// module.exports = mongoose.model('WorkshopCertificate', workshopCertificateSchema);