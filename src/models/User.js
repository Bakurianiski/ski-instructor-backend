import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'სახელი სავალდებულოა'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'ელ. ფოსტა სავალდებულოა'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'გთხოვთ შეიყვანოთ სწორი ელ. ფოსტა']
  },
  password: {
    type: String,
    required: [true, 'პაროლი სავალდებულოა'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'instructor'],
    default: 'instructor'
  },
  phone: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
