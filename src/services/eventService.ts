import Event, { IEvent } from "../models/event";
import {
  getEvent,
  getEventsByOfficerId,
  getOfficerById,
} from "../utils/helperFuncs";
import { getSubordinatesByOfficerId } from "./officerService";
import mongoose from "mongoose";
import { ISoldierLocation } from "../models/event";
import Officers from "../models/Officer";
import { sendSmsToSoldiers } from "../utils/communications";

export const getEventHistoryService = async (officerId: string) => {
  try {
    const officer = await getOfficerById(officerId);
    if (!officer) {
      throw new Error("Officer not found");
    }

    const events = await getEventsByOfficerId(officerId);

    if (!events || events.length === 0) {
      throw new Error(`No events found for officer ${officer.fullName}`);
    }

    const inactiveEvents = events.filter(event => !event.isActive);

    if (inactiveEvents.length === 0) {
      throw new Error(`No inactive events found for officer ${officer.fullName}`);
    }

    return inactiveEvents;
  } catch (error: any) {
    throw new Error("An error occurred while fetching inactive events.");
  }
};

export const getEventService = async (eventId: string) => {
  try {
    const event = await getEvent(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  } catch (error: any) {
    throw new Error("An error occurred while fetching event.");
  }
};

export const getActiveEventsService = async (officerId: string) => {
  try {
    const officer = await getOfficerById(officerId);
    if (!officer) {
      throw new Error("Officer not found");
    }

    const events = await getEventsByOfficerId(officerId);

    if (!events || events.length === 0) {
      throw new Error(`No events found for officer ${officer.fullName}`);
    }

    const activeEvents = events.filter(event => event.isActive);

    if (activeEvents.length === 0) {
      throw new Error(`No active events found for officer ${officer.fullName}`);
    }

    return activeEvents;
  } catch (error: any) {
    throw new Error("An error occurred while fetching inactive events.");
  }
};

export const createEventService = async (
  commanderId: string,
  teamLeaders: string[],
  time: string
): Promise<IEvent> => {
  try {
    const commander = await getOfficerById(commanderId);
    if (!commander) {
      throw new Error("commander not found");
    }

    const teamLeadersId: mongoose.Schema.Types.ObjectId[] =
      await getArrayOfTeamLeadersId(teamLeaders);
    if (!teamLeadersId) {
      throw new Error("no team leaders found.");
    }

    const teamLeadersIdAsString = teamLeadersId.map((id) => id.toString());

    const soldiersInEvent = await getISoldiersInEvent(teamLeadersIdAsString);

    const event = new Event({
      commanderId: commander.id,
      teamLeaders: teamLeadersId,
      isActive: true,
      timer: Number(time),
      soldiers: soldiersInEvent,
    });

    await event.save();

    await sendSmsToSoldiers(soldiersInEvent, event.id);
    
    deactivateAfterTimeout(event);
    return event;
  } catch (err: any) {
    throw new Error(err.message || "An error occurred while creating event.");
  }
};

const deactivateAfterTimeout = (event: IEvent) => {
  const timeoutInMinutes = event.timer * 60 * 1000;
  setTimeout(async () => {
    try {
      await Event.updateOne( 
        { _id: event._id },  
        { $set: { isActive: false } } 
      );
    } catch (err) {
    }
  }, timeoutInMinutes);
};

const getArrayOfTeamLeadersId = async (
  teamLeaders: string[]
): Promise<mongoose.Schema.Types.ObjectId[]> => {
  const teamLeadersInEvent = await Officers.find({ _id: { $in: teamLeaders } });
  console.log(
    "teamLeaders: ",
    teamLeaders,
    "teamLeadersArray: ",
    teamLeadersInEvent
  );
  return teamLeadersInEvent.map((tl) => tl.id);
};

const getISoldiersInEvent = async (
  teamLeadersId: string[]
): Promise<ISoldierLocation[]> => {
  try {
    const soldiers = await Promise.all( 
      teamLeadersId.map(tLId => getSubordinatesByOfficerId(tLId))
    );

    if (!soldiers || soldiers.length == 0) {
      throw new Error("")
    }

    const soldiersInEvent: ISoldierLocation[] = soldiers
    .flat()
    .filter((soldier): soldier is NonNullable<typeof soldier> => !!soldier)
    .map((soldier) => ({
      soldierId: soldier.id,
      soldierName: soldier.fullName, 
      location: null, 
    })
  );
  return soldiersInEvent
  } catch (error) {
    return [];
  }
};
