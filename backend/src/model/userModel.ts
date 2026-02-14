import mongoose from "mongoose";
import { comparePassword, hashingPassword, logger } from "../utils";

export interface IUser extends mongoose.Document {
  username: string;
  fullname: string;
  email: string;
  password: string;
  photo: string;
  role: string;
  authProvider: string;
  isActive: boolean;
  googleId: string;
  isEmailVerified: boolean;
  lastLogin: Date;

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
    },
    fullname: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
      // select: false,
    },
    photo: {
      type: String,
      default: "",
      required: false,
    },
    role: {
      type: String,
      enum: ["mahasiswa", "dosen", "hmp", "admin", "user"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow null but unique if exists
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
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
  },
);

userSchema.index({ email: 1 }, { unique: true, name: "email_index_unique" });
userSchema.index(
  { googleId: 1 },
  { unique: true, sparse: true, name: "googleId_index_unique_sparse" },
);

userSchema.pre("save", async function (next) {
  if (
    !this.isModified("password") ||
    !this.password ||
    typeof this.password !== "string"
  ) {
    return next();
  }

  try {
    this.password = await hashingPassword(this.password);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return await comparePassword(password, this.password);
};
const UserModel = mongoose.model<IUser>("user_collection", userSchema);
export default UserModel;
