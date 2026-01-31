import Session from '../models/Session.js';

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Public
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ isActive: true }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'სერვერის შეცდომა',
      error: error.message
    });
  }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Public
export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'გაკვეთილი არ მოიძებნა'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'სერვერის შეცდომა',
      error: error.message
    });
  }
};

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private (Admin only)
export const createSession = async (req, res) => {
  try {
    const session = await Session.create(req.body);

    res.status(201).json({
      success: true,
      message: 'გაკვეთილი წარმატებით შეიქმნა',
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'გაკვეთილის შექმნა ვერ მოხერხდა',
      error: error.message
    });
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private (Admin only)
export const updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'გაკვეთილი არ მოიძებნა'
      });
    }

    res.status(200).json({
      success: true,
      message: 'გაკვეთილი წარმატებით განახლდა',
      data: session
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'გაკვეთილის განახლება ვერ მოხერხდა',
      error: error.message
    });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private (Admin only)
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'გაკვეთილი არ მოიძებნა'
      });
    }

    res.status(200).json({
      success: true,
      message: 'გაკვეთილი წარმატებით წაიშალა'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'გაკვეთილის წაშლა ვერ მოხერხდა',
      error: error.message
    });
  }
};