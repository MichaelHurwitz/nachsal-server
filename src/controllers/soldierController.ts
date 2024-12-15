import { Request, Response } from "express";
import { updateSoldierLocation, validateSoldierEvent } from "../services/soldierService";

export const validateSoldierEventController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { personalNumber, eventId } = req.params;

    if (!personalNumber || !eventId) {
      res.status(400).json({ message: "Missing personalNumber or eventId" });
      return;
    }

    const soldier = await validateSoldierEvent(personalNumber, eventId);

    res.status(200).json({ message: "Soldier validation successful", soldier });
  } catch (error: any) {
    // console.error("Error during soldier validation:", error.message);
    res.status(400).json({ message: error.message || "Validation failed" });
  }
};

export const updateSoldierLocationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId, soldierName, location } = req.body;

    if (!eventId || !soldierName || !location || !location.lat || !location.lng) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    await updateSoldierLocation(eventId, soldierName, location);
    res.status(200).json({ message: `Location updated successfully for soldier ${soldierName}` });
  } catch (error: any) {
    // console.error("Error in updateSoldierLocationController:", error.message || error);
    res.status(500).json({ message: error.message || "Failed to update soldier location" });
  }
};