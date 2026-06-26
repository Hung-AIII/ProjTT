const Contact = require('../models/Contact')

const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' })
    }
    const contact = await Contact.create({ name, email, subject, message })
    res.status(201).json({ success: true, message: 'Gửi tin nhắn thành công', contact })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 })
    res.json(contacts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const markAsRead = async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createContact, getContacts, markAsRead }