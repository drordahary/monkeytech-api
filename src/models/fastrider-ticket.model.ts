import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize";
import { FastRiderSlot } from "./fastrider-slot.model";

type TicketStatus = "ACTIVE" | "USED" | "CANCELLED";

export class FastRiderTicket extends Model {
  declare id: string;
  declare userId: string;
  declare slotId: string;
  declare status: TicketStatus;
  declare slot?: FastRiderSlot;
}

FastRiderTicket.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: { type: DataTypes.UUID, field: "user_id" },
    slotId: { type: DataTypes.UUID, field: "slot_id" },
    status: DataTypes.ENUM("ACTIVE", "USED", "CANCELLED"),
  },
  {
    sequelize,
    tableName: "fastrider_tickets",
    underscored: true,
  },
);
