    import mongoose, { Document, Schema, Model } from "mongoose";

    export interface ISoldierLocation {
        soldierId: mongoose.Schema.Types.ObjectId;
        soldierName: string;
        location: { lat: string; lng: string } | null;
    }

    export interface TeamEvent {
        eventId: mongoose.Schema.Types.ObjectId;
        teamLeaderId: string;
        soldiers: ISoldierLocation[];
      }

    export interface IEvent extends Document {
        commanderId: mongoose.Schema.Types.ObjectId;
        isActive: boolean;
        teamLeaders: mongoose.Schema.Types.ObjectId[];
        soldiers: ISoldierLocation[];
        timer: number
        createdAt?: Date;
        updatedAt?: Date;
    }

    const SoldierSchema = new Schema<ISoldierLocation>(
        {
            soldierId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            soldierName: {
                type: String,
                required: true,
            },
            location: {
                type: {
                  lat: { type: String, default: null }, 
                  lng: { type: String, default: null }, 
                },
                default: null,
            },
        },
        { _id: false } 
    );

    const EventSchema: Schema<IEvent> = new Schema<IEvent>(
        {
            commanderId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Officer", 
            },
            isActive: {
                type: Boolean,
                required: true,
            },
            teamLeaders: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: "TeamLeader", 
            },
            soldiers: {
                type: [SoldierSchema], 
                required: true,
            },
            timer: {
                type: Number,
                default: 5,
                required: true
            }    
        },
        { timestamps: true } 
    );

    const Events: Model<IEvent> = mongoose.model<IEvent>("Event", EventSchema);

    export default Events;
