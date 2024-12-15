import e, { Request, Response } from "express";
import { getEventHistoryService, getEventService } from '../services/eventService'
import { getActiveEventsService, createEventService } from "../services/eventService";

export const getEventsHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { officerId } = req.body;

    const events = await getEventHistoryService(officerId)

    if (events && events.length > 0) {
      res.status(200).json(events);
    } else {
      res.status(404).json({ message: "No events found." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching events." });
  }
}

  export const getActiveEvents = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {officerId} = req.body;
  
      const activeEvents = await getActiveEventsService(officerId)
      if (activeEvents){
        if (activeEvents.length > 0) {
          res.status(200).json(activeEvents);
        } else {
          res.status(404).json({ message: "No active events found." });
        }
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching events." });
    }
  }

  export const getEvent = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {eventId} = req.body;
  
      const event = await getEventService(eventId)
      if (event){
          res.status(200).json(event);
        } else {
          res.status(404).json({ message: "Events not found." });
        }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching event." });
    }
  }

export const createEvent = async (req: Request, res: Response) => {
  try {
    debugger;
    const { commanderId, teamLeaders, time } = req.body;
    const event = await createEventService(commanderId, teamLeaders, time);
    res.status(200).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message, success: false });
  }
}