import twilio from "twilio";
import { ISoldierLocation } from "../models/event";
import { getSoldierByName } from "./helperFuncs";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export const sendSmsToSoldiers = async (
  soldiers: ISoldierLocation[],
  eventId: string
): Promise<void> => {
  const baseUrl = `${client}/Soldier`; 

  for (const sol of soldiers) {
    const soldierName = sol.soldierName;
    const soldier = await getSoldierByName(soldierName);
    if (!soldier) {
      throw new Error("Soldier by name was not found");
    }
    try {
      const link = `${baseUrl}?eventId=${eventId}&personalNumber=${soldier.personalNumber}`;
      const message = `Hello ${soldierName},\nA nachsal event has been created. Please report your location urgently using the following link:\n${link}`;

      console.log(
        `Sending SMS to ${soldierName}, p.n: ${soldier.personalNumber}...`
      );

      await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: soldier.phone, // הטלפון של החייל
      });

      console.log(`SMS sent to ${soldierName}, p.n: ${soldier.personalNumber}`);
    } catch (error) {
      console.error(
        `Failed to send SMS to ${soldierName}, p.n: ${soldier.personalNumber}:`,
        error
      );
    }
  }
};
