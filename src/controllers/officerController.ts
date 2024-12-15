import e, { Request, Response } from "express";
import mongoose from "mongoose";
import { login, getSubordinatesByOfficerId, getAllBasesService, getTeamLeadersByBaseService } from "../services/officerService";

export const loginOfficer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = await login(req.body);
    res.status(200).json({ message: "Login successful", token:token.token, data:token.officerWithoutPassword });
  } catch (error) {
    console.error("Error during officer login:", error);
    if (
      error instanceof Error &&
      error.message.includes("Invalid credentials")
    ) {
      res.status(401).json({ message: "Invalid credentials." });
    } else if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ message: "Officer not found." });
    } else {
      res
        .status(500)
        .json({ message: "An error occurred during officer login." });
    }
  }
};

export const getSubordinates = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { officerId } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(officerId)) {
      res.status(400).json({ message: "Invalid Officer ID" });
      return;
    }
    const subordinates = await getSubordinatesByOfficerId(officerId);
    if (!subordinates) {
      res.status(404).json({ message: "no Subordinates found" });
      return;
    }
    res.status(200).json(subordinates);
  } catch (e:any) {
    res.status(500).json({ message: e.message });
  }
};

export const getBases = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bases = await getAllBasesService();
    if (!bases) {
      res.status(404).json({ message: "no bases found" });
      return;
    }
    res.status(200).json(bases);
  } catch (e) {
    res.status(500).json({ message: "Error fetching bases" });
  }
};

export const getTeamLeadersByBase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {baseName} = req.body
    const teamLeaders = await getTeamLeadersByBaseService(baseName);
    if (!teamLeaders) {
      res.status(404).json({ message: "no team leaders found" });
      return;
    }
    res.status(200).json(teamLeaders);
  } catch (e) {
    res.status(500).json({ message: "Error fetching team leaders" });
  }
};


