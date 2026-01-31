import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  title: {
    ka: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true }
  },
  duration: {
    ka: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true }
  },
  price: {
    type: Number,
    required: [true, 'ფასი სავალდებულოა'],
    min: 0
  },
  currency: {
    type: String,
    default: '₾'
  },
  level: {
    ka: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true }
  },
  maxStudents: {
    type: Number,
    required: [true, 'მაქსიმალური მოსწავლეების რაოდენობა სავალდებულოა'],
    min: 1
  },
  description: {
    ka: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true }
  },
  image: {
    type: String,
    default: '⛷️'
  },
  isActive: {
    type: Boolean,
    default: true
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

sessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;