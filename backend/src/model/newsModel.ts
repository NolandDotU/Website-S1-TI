import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 100,
    },
    category: {
      type: String,
      required: true,
      enum: ["berita", "lowongan", "pengumuman"],
    },
    content: {
      type: String,
      required: true,
      maxLength: 20000,
    },
    link: String,
    photo: String,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    eventDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

newsSchema.index({ title: "text" });

const NewsModel = mongoose.model("news_collection", newsSchema);
export default NewsModel;
