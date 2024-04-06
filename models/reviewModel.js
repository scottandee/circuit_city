const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    max: 5,
    min: 0,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

const Reviews = mongoose.model('Reviews', reviewSchema);
module.exports = Reviews;
