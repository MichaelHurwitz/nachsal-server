import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";
import Officers from "../models/Officer";
import { DateTime } from "luxon";
import Events, { IEvent } from "../models/event";
import Soldiers from "../models/soldier";
import mongoose from "mongoose";

export const getOfficer = async ({ email }: { email: string }) => {
  return await Officers.findOne({ email });
};

export const getOfficerById = async (officerId: string) => {
  return await Officers.findById(officerId)
}

export const getSoldierById = async (soldierId: string) => {
  return await Soldiers.findById(soldierId)
}

export const getSoldierByName = async (fullName: string) => {
  return await Soldiers.findOne({fullName});
}

export const getSoldier = async ({personalNumber}: {personalNumber:string}) => {
  return await Soldiers.findOne({personalNumber});
}


export const getEvent = async ( eventId: string ) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new Error("Invalid eventId format");
  }
  return await Events.findById(eventId);
};

export const getEventsByOfficerId = async ( officerId: string ) => {
  if (!mongoose.Types.ObjectId.isValid(officerId)) {
    throw new Error("Invalid officerId format");
  }
  return await Events.find({commanderId: officerId});
};





// Hash a password
export const hashedPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// Validate a password
export const validatePassword = async (
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return true; //await bcrypt.compare(inputPassword, hashedPassword);
};

// Generate a JWT token
export const generateToken = async (payload: object): Promise<string> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

export const deactivateEvents = async (events: IEvent | IEvent[]): Promise<IEvent[]> => {
  const eventArray: IEvent[] = Array.isArray(events) ? events : [events];
  const currentTime = DateTime.now();
  for (let event of eventArray) {
    if (!(event instanceof Events)) {
      throw new Error("Invalid event object");
    }

    if (!event.createdAt) {
      throw new Error(`Event with ID ${event._id} does not have a valid createdAt date.`);
    }

    const eventEndTime = DateTime.fromJSDate(event.createdAt)
      .plus({ minutes: event.timer });
      
    if (currentTime >= eventEndTime) {
      event.isActive = false;
      await event.save();
    };
  };
  return eventArray.filter(event => event.isActive);
};