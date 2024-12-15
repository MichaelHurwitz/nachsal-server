import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISoldier extends Document {
    fullName: string;
    personalNumber: string;
    phone: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const SoldierSchema: Schema<ISoldier> = new Schema<ISoldier>(
    {
        fullName: {
            type: String,
            required: true,
        },
        personalNumber: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Soldiers: Model<ISoldier> = mongoose.model<ISoldier>('Soldier', SoldierSchema);

export default Soldiers;
