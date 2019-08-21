const mongoose = require('mongoose');

const docSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    title: {
      type: String,
      required: true,
      maxlength: 1000
    },
    content: {
      type: String,
      maxlength: 100000
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
    }
  },
  { timestamps: true }
);

const documentModel = mongoose.model('documents', docSchema);

module.exports = documentModel;
