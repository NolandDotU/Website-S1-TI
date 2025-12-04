const mongoose = require("mongoose");

const lecturerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    errors: {
      required: "Username is required",
      unique: "Username already exists",
    },
  },
  fullname: {
    type: String,
    required: true,
    errors: {
      required: "Fullname is required",
    },
  },
  expertise: [
    {
      type: String,
      required: true,
    },
  ],
  email: {
    type: Email,
    required: true,
    unique: true,
    trim: true,
    errors: {
      required: "Email is required",
      unique: "Email already exists",
    },
  },
  externalLink: {
    type: String,
    required: false,
  },
  photo: {
    type: String,
    required: false,
  },
});

const LecturerModel = mongoose.model("Lecturer", lecturerSchema);

module.exports = LecturerModel;
