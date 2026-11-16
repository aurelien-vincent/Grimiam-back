import { model, Schema } from "mongoose";

export interface User {
  displayName: string;
  email: string;
  passwordHash: string;
  emailVerifiedAt?: Date;
}

const userSchema = new Schema<User>(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    // Le hash est exclu des lectures ordinaires. Le service d'authentification
    // devra le demander explicitement avec .select("+passwordHash").
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    emailVerifiedAt: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_document, result) {
        delete result.passwordHash;
        return result;
      },
    },
  },
);

export const UserModel = model<User>("User", userSchema);
