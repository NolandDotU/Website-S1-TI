import mongoose, { Document, Schema } from "mongoose";
import { ILecturerDoc, ILecturer } from "../api/v1/lecturer/lecturer.dto";

export const LecturerSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minLength: [4, "Username must be at least 4 characters long"],
      maxLength: [100, "Username must be at most 100 characters long"],
    },
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      minLength: [4, "Username must be at least 4 characters long"],
      maxLength: [100, "Username must be at most 100 characters long"],
    },
    expertise: {
      type: [String],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    externalLink: {
      type: String,
    },
    photo: {
      type: String,
    },
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

// LecturerSchema.index({ username: 1 }, { unique: true });
// LecturerSchema.index({ email: 1 }, { unique: true });

export const LecturerModel = mongoose.model<ILecturerDoc>(
  "lecturer_collection",
  LecturerSchema
);
