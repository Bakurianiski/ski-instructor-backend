import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: [true, 'გაკვეთილი სავალდებულოა']
  },
  name: {
    type: String,
    required: [true, 'სახელი სავალდებულოა'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'ელ. ფოსტა სავალდებულოა'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'გთხოვთ შეიყვანოთ სწორი ელ. ფოსტა']
  },
  phone: {
    type: String,
    required: [true, 'ტელეფონი სავალდებულოა'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'თარიღი სავალდებულოა']
  },
  students: {
    type: Number,
    required: [true, 'მოსწავლეთა რაოდენობა სავალდებულოა'],
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
    language: {
    type: String,
    enum: ['ka', 'en', 'ru'],
    default: 'ka'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;