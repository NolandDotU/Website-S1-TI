import mongoose from "mongoose";
import { isUKSWEmail } from "../config/google-oauth";
import { comparePassword, hashingPassword } from "../utils";

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
      required: true,
      minLength: [4, "Username must be at least 4 characters long"],
      maxLength: [100, "Username must be at most 100 characters long"],
    },
    fullname: {
      type: String,
      minLength: [4, "Username must be at least 4 characters long"],
      maxLength: [100, "Username must be at most 100 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          return isUKSWEmail(email);
        },
        message:
          "Email harus menggunakan domain @student.uksw.edu atau @uksw.edu",
      },
    },
    password: {
      type: String,
      required: false,
      minLength: [8, "Password must be at least 4 characters long"],
      maxLength: [12, "Password must be at most 100 characters long"],
    },
    photo: {
      type: String,
      default: "",
      required: false,
    },
    role: {
      type: String,
      enum: ["lecturer", "student", "admin"],
      default: "admin",
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
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
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
  password: string
): Promise<boolean> {
  return await comparePassword(password, this.password);
};
const UserModel = mongoose.model<IUser>("user_collection", userSchema);
export default UserModel;
