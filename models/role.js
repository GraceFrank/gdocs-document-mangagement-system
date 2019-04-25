import mongoose from 'mongoose';

//defining schema for the role model
const roleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
    lowercase: true
  }
});

//compiling the role schema into a model Class
const Role = mongoose.model('roles', roleSchema);
