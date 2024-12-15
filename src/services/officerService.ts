import _ from "lodash";
import {
  generateToken,
  getOfficer,
  getOfficerById,
  getSoldierById,
  validatePassword,
} from "../utils/helperFuncs";
import { Bases } from "../models/base";


export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const officer = await getOfficer({ email });

  if (!officer) {
    throw new Error("Officer not found");
  }

  const isPasswordValid = await validatePassword(password, officer.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials.");
  }

  const token = await generateToken({
    id: officer._id,
    email: officer.email,
    isCommander: officer.isCommander,
  });
  const officerWithoutPassword = _.omit(officer.toObject(), ["password"]);
  return { token, officerWithoutPassword };
};

export const getSubordinatesByOfficerId = async (officerId: string) => {
  const officer = await getOfficerById(officerId);
  if (!officer) throw new Error("Officer not found");
  if (!officer.subordinates || officer.subordinates.length === 0) {
    throw new Error("No subordinates found for this officer");
  }
  const subs = officer.subordinates;
  const subIds = subs.map(sub => sub.subordinateId);
  const subordinatesObj = await Promise.all(
    subIds.map((subId) => 
      officer.isCommander 
        ? getOfficerById(subId.toString()) 
        : getSoldierById(subId.toString())
    )
  );
    return subordinatesObj;
};

export const getAllBasesService = async () => {
    const bases = await Bases.find()
    if (!bases || bases.length === 0) throw new Error("no bases found");
    return bases;
};

export const getTeamLeadersByBaseService = async (baseName: string) => {
  const base = await Bases.find({ name: baseName })
      .populate({
          path: "teamLeaders",
          populate: {
              path: "subordinates.subordinateId",
              model: "Officer", 
          },
      });

  if (!base || base.length === 0) throw new Error("No bases found");

  return base[0].teamLeaders;
};


