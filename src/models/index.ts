import { Area } from "./area.model";
import { Location } from "./location.model";
import { FastRiderSlot } from "./fastrider-slot.model";
import { FastRiderTicket } from "./fastrider-ticket.model";

export function setupAssociations() {
  Area.hasMany(Location, {
    foreignKey: "areaId",
    as: "locations",
  });

  Location.belongsTo(Area, {
    foreignKey: "areaId",
    as: "area",
  });

  Location.hasMany(FastRiderSlot, {
    foreignKey: "attractionId",
    as: "slots",
  });

  FastRiderSlot.belongsTo(Location, {
    foreignKey: "attractionId",
    as: "attraction",
  });

  FastRiderSlot.hasMany(FastRiderTicket, {
    foreignKey: "slotId",
    as: "tickets",
  });

  FastRiderTicket.belongsTo(FastRiderSlot, {
    foreignKey: "slotId",
    as: "slot",
  });
}

export { Area, Location };
export { User } from "./user.model";
export { AuthCode } from "./auth-code.model";
