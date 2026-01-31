import Booking from '../models/Booking.js';
import Session from '../models/Session.js';
import { sendBookingEmail } from '../utils/emailService.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
   const { session: sessionId, name, email, phone, date, students, notes, language } = req.body;

    // Check if session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'გაკვეთილი არ მოიძებნა'
      });
    }

    // Check if students number is valid
    if (students > session.maxStudents) {
      return res.status(400).json({
        success: false,
        message: `მაქსიმალური მოსწავლეების რაოდენობაა ${session.maxStudents}`
      });
    }

    // Calculate total price
    const totalPrice = session.price * students;

    // Create booking
const booking = await Booking.create({
  session: sessionId,
  name,
  email,
  phone,
  date,
  students,
  totalPrice,
  notes,
  language: language || 'ka'  // default: Georgian
});

  // Populate session details
    await booking.populate('session');

   // Send confirmation email to customer
try {
  await sendBookingEmail({
    to: email,
    booking: booking,
    type: 'confirmation'
  });
  console.log('✅ მომხმარებლის ელ. ფოსტა გაიგზავნა:', email);
} catch (emailError) {
  console.error('❌ მომხმარებლის ელ. ფოსტა ვერ გაიგზავნა:', emailError);
}

// Send notification email to admin
try {
  await sendBookingEmail({
    to: process.env.EMAIL_USER, // შენი email
    booking: booking,
    type: 'admin_notification'
  });
  console.log('✅ ადმინის notification გაიგზავნა');
} catch (emailError) {
  console.error('❌ ადმინის notification ვერ გაიგზავნა:', emailError);
}

    res.status(201).json({

      success: true,
      message: 'დაჯავშნა წარმატებით შესრულდა! მალე დაგიკავშირდებით.',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'დაჯავშნა ვერ მოხერხდა',
      error: error.message
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin only)
export const getAllBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('session')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'სერვერის შეცდომა',
      error: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private (Admin only)
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('session');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'ჯავშანი არ მოიძებნა'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'სერვერის შეცდომა',
      error: error.message
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('session');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'ჯავშანი არ მოიძებნა'
      });
    }

    res.status(200).json({
      success: true,
      message: 'სტატუსი წარმატებით განახლდა',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'სტატუსის განახლება ვერ მოხერხდა',
      error: error.message
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin only)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'ჯავშანი არ მოიძებნა'
      });
    }

    res.status(200).json({
      success: true,
      message: 'ჯავშანი წარმატებით წაიშალა'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ჯავშნის წაშლა ვერ მოხერხდა',
      error: error.message
    });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private (Admin only)
export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Get revenue
    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'სტატისტიკის მიღება ვერ მოხერხდა',
      error: error.message
    });
  }
};