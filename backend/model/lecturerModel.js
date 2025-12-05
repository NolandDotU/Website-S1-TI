import mongoose from "mongoose";

const lecturerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  expertise: [
    {
      type: String,
      required: true,
    },
  ],
  email: {
    type: String, // Bukan Email
    required: true,
    unique: true,
    trim: true,
  },
  externalLink: String,
  photo: String,
});

const LecturerModel = mongoose.model("Lecturer", lecturerSchema);

export default LecturerModel;
