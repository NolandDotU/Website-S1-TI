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
      enum: ["event", "lowongan", "pengumuman"],
    },
    content: {
      type: String,
      required: true,
    },
    link: String,
    photo: String,
    source: String,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "draft",
      enum: ["draft", "scheduled", "published", "archived"],
    },
    scheduleDate: {
      type: Date,
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

announcementSchema.index({ title: 1 });

const AnnouncementModel = mongoose.model(
  "announcement_collection",
  announcementSchema
);
export default AnnouncementModel;
