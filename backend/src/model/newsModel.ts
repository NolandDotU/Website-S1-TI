import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['berita', 'lowongan', 'pengumuman']
  },
  content: {
    type: String,
    required: true,
  },
  link: String,
  photo: String,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  eventDate: Date,
}, {
  timestamps: true
});

const NewsModel = mongoose.model("news_collection", newsSchema);

export default NewsModel;
