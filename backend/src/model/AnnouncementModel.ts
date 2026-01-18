import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 100,
    },
    category: {
      type: String,
      required: true,
      enum: ["event", "lowongan", "pengumuman", "alumni"],
    },
    content: {
      type: String,
      required: true,
    },
    link: String,
    photo: String,
    source: String,
    publishDate: {
      type: Date,
    },
    status: {
      type: String,
      default: "draft",
      enum: ["draft", "scheduled", "published", "archived"],
    },
    scheduleDate: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    eventDate: Date,
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

announcementSchema.index({ title: "text", status: 1, content: "text" });

const AnnouncementModel = mongoose.model(
  "announcement_collection",
  announcementSchema
);
export default AnnouncementModel;
