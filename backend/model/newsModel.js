import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["berita", "pengumuman", "event"],
  },
});
