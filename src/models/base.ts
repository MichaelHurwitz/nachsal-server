import mongoose, { Schema, Document, Types } from 'mongoose';


interface IBase extends Document {
    name: string; 
    teamLeaders: Types.ObjectId[]; 
  }
  
  const BaseSchema = new Schema<IBase>({
    name: { type: String, required: true }, 
    teamLeaders: [{ type: Schema.Types.ObjectId, ref: 'Officer', required: true }], 
  });
  
  export const Bases = mongoose.model<IBase>('Base', BaseSchema)