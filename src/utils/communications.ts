import twilio from "twilio";
import { ISoldierLocation } from "../models/event";
import { getSoldierByName } from "./helperFuncs";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioWhatsAppNumber = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`; // המספר של Twilio WhatsApp
const client = twilio(accountSid, authToken);
const clientApi = process.env.CLIENT_APP;

export const sendWhatsAppToSoldiers = async (
  soldiers: ISoldierLocation[],
  eventId: string
): Promise<void> => {
  const baseUrl = `${clientApi}`;

  for (const sol of soldiers) {
    const soldierName = sol.soldierName;
    const soldier = await getSoldierByName(soldierName);
    if (!soldier) {
      throw new Error("Soldier by name was not found");
    }

    try {
      const link = `${baseUrl}/Soldier/location/${eventId}/${soldier.personalNumber}`;
      const message = `שלום ${soldierName},\nנוצר אירוע מל"ח. אנא דווח על מיקומך בהקדם באמצעות הקישור הבא:\n${link}`;

      console.log(
        `Sending WhatsApp to ${soldierName}, p.n: ${soldier.personalNumber}...`
      );

      await client.messages.create({
        body: message,
        from: twilioWhatsAppNumber, // מספר הוואטסאפ של Twilio
        to: `whatsapp:${soldier.phone}`, // מספר הוואטסאפ של החייל
      });

      console.log(
        `WhatsApp sent to ${soldierName}, p.n: ${soldier.personalNumber}`
      );
    } catch (error) {
      console.error(
        `Failed to send WhatsApp to ${soldierName}, p.n: ${soldier.personalNumber}:`,
        error
      );
    }
  }
};
