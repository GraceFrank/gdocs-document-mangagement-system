import mongoose from 'mongoose';

const docSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  title: {
    type: String,
    required: true,
    maxlength: 1000,
    unique: true
  },
  content: {
    type: String,
    maxlength: 100000
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },

  modifiedAt: {
    type: Date,
    default: Date.now
  },
  access: {
    type: String,
    enum: ['public', 'private', 'role'],
    default: 'public'
  },
  role: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'roles'
  },
  timestamp: { type: Number, default: new Date().getTime() }
});

const Document = mongoose.model('documents', docSchema);

export default Document;
