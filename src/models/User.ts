import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    avatar: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    // Verification & Recruitment flow fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOtp: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationOtpExpires: {
      type: Date,
      default: null,
      select: false,
    },
    emailVerificationOtpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    emailVerificationOtpLastSentAt: {
      type: Date,
      default: null,
      select: false,
    },
    hasSubmittedInterview: {
      type: Boolean,
      default: false,
    },
    // Password reset fields
    resetPasswordOtp: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordOtpExpires: {
      type: Date,
      default: null,
      select: false,
    },
    resetPasswordOtpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    resetPasswordOtpLastSentAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving and invalidate prior sessions
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  this.passwordChangedAt = new Date();
});

UserSchema.methods.comparePassword = async function (passwordToCheck: string): Promise<boolean> {
  return await bcrypt.compare(passwordToCheck, this.password);
};

UserSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.password;
    delete ret.emailVerificationOtp;
    delete ret.emailVerificationOtpExpires;
    delete ret.emailVerificationOtpAttempts;
    delete ret.emailVerificationOtpLastSentAt;
    delete ret.resetPasswordOtp;
    delete ret.resetPasswordOtpExpires;
    delete ret.resetPasswordOtpAttempts;
    delete ret.resetPasswordOtpLastSentAt;
    return ret;
  },
});

UserSchema.set("toObject", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.password;
    delete ret.emailVerificationOtp;
    delete ret.emailVerificationOtpExpires;
    delete ret.emailVerificationOtpAttempts;
    delete ret.emailVerificationOtpLastSentAt;
    delete ret.resetPasswordOtp;
    delete ret.resetPasswordOtpExpires;
    delete ret.resetPasswordOtpAttempts;
    delete ret.resetPasswordOtpLastSentAt;
    return ret;
  },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
