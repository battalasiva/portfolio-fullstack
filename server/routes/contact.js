const express = require('express');
const router = express.Router();
const { Contact, ContactMessage } = require('../models/Contact');

// GET contact info
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact info not found. Please create one first.' 
      });
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE contact info
router.post('/', async (req, res) => {
  try {
    const existingContact = await Contact.findOne();
    if (existingContact) {
      return res.status(400).json({ 
        success: false, 
        message: 'Contact info already exists. Use PUT to update.' 
      });
    }
    
    const contact = new Contact(req.body);
    const savedContact = await contact.save();
    res.status(201).json({ success: true, data: savedContact });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE contact info
router.put('/', async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      {}, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact info not found. Create one first.' 
      });
    }
    
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE contact info
router.delete('/', async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete();
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact info not found' 
      });
    }
    res.json({ success: true, message: 'Contact info deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// === CONTACT MESSAGES ROUTES ===

// CREATE contact message
router.post('/messages', async (req, res) => {
  try {
    const message = new ContactMessage(req.body);
    const savedMessage = await message.save();
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully', 
      data: savedMessage 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET all messages with filtering
router.get('/messages', async (req, res) => {
  try {
    const { status, isRead, limit, page } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);
      
    const total = await ContactMessage.countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: messages,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        count: messages.length,
        totalRecords: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single message
router.get('/messages/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    res.json({ success: true, data: message });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid message ID' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE message (mark as read, change status)
router.put('/messages/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    
    res.json({ success: true, data: message });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid message ID' 
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE message
router.delete('/messages/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Message deleted successfully',
      data: message 
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid message ID' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;