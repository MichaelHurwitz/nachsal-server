import mongoose from "mongoose";
import { getEvent, getSoldier } from "../utils/helperFuncs";

export const validateSoldierEvent = async (
  personalNumber: string,
  eventId: string
) => {
  try {
    const event = await getEvent( eventId );

    if (!event) {
      throw new Error("no event was found");
    }
    if (!event.isActive) {
      throw new Error("Event is not active");
    }

    const soldier = await getSoldier({ personalNumber });

    if (!soldier) {
      throw new Error("soldier was not found");
    }
    
    const soldierInEvent = event.soldiers.find(
      (s) => s.soldierName === soldier.fullName
    );
    if (!soldierInEvent) {
      throw new Error("Soldier is not part of this event");
    }
    if (soldierInEvent.location) {
      throw new Error("Soldier has already reported location");
    }
    return soldierInEvent
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while getting the soldier"
    );
  }
};

export const updateSoldierLocation = async (
  eventId: string,
  soldierName: string,
  location: { lat: string; lng: string }
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Invalid eventId format");
    }

    const event = await getEvent(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const soldier = event.soldiers.find(
      (s) => s.soldierName === soldierName
    );

    if (!soldier) {
      throw new Error("Soldier not found in this event");
    }

    soldier.location = location;

    await event.save();
  } catch (error: any) {
    throw new Error(error.message || "An error occurred while updating soldier location.");
  }
};