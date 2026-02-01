import { Op } from "sequelize";
import { FastRiderSlot } from "../models/fastrider-slot.model";
import { Location } from "../models/location.model";

const PARK_OPEN_HOUR = 9;
const PARK_CLOSE_HOUR = 19;
const SLOT_MINUTES = 30;
const TICKETS_PER_DAY = 100;

export async function generateSlotsForDate(date: string) {
  const attractions = await Location.findAll({
    where: { supportsFastrider: true },
  });

  const totalMinutes = (PARK_CLOSE_HOUR - PARK_OPEN_HOUR) * 60;
  const slotCount = totalMinutes / SLOT_MINUTES;
  const capacityPerSlot = Math.floor(TICKETS_PER_DAY / slotCount);

  for (const attraction of attractions) {
    const existing = await FastRiderSlot.count({
      where: {
        attractionId: attraction.id,
        date,
      },
    });

    if (existing > 0) {
      continue;
    }

    for (let i = 0; i < slotCount; i++) {
      const startMinutes = PARK_OPEN_HOUR * 60 + i * SLOT_MINUTES;
      const endMinutes = startMinutes + SLOT_MINUTES;

      const startTime = minutesToTime(startMinutes);
      const endTime = minutesToTime(endMinutes);

      await FastRiderSlot.create({
        attractionId: attraction.id,
        date,
        startTime,
        endTime,
        capacity: capacityPerSlot,
        remaining: capacityPerSlot,
      });
    }
  }
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
