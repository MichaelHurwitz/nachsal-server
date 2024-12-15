import mongoose, { Document, Schema, Model } from "mongoose";

export interface IOfficer extends Document {
  password: string;
  fullName: string;
  email: string;
  subordinates?: {
    kind: string; subordinateId: string 
}[] | [];
  isCommander: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const OfficerSchema: Schema<IOfficer> = new Schema<IOfficer>(
  {
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    subordinates: [
      {
        subordinateId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "subordinates.kind", // Dynamic reference
        },
        kind: {
          type: String,
          required: true,
          enum: ["Soldier", "Officer"], // Allowed models
        },
      },
    ],
    isCommander: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  { timestamps: true }
);

const Officers: Model<IOfficer> = mongoose.model<IOfficer>(
  "Officer",
  OfficerSchema
);

export default Officers;

