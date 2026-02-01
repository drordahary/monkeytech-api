import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize";
import { Location } from "./location.model";

export class FastRiderSlot extends Model {
  declare id: string;
  declare attractionId: string;
  declare date: string;
  declare startTime: string;
  declare endTime: string;
  declare capacity: number;
  declare remaining: number;
  declare attraction?: Location;
}

FastRiderSlot.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    attractionId: { type: DataTypes.UUID, field: "attraction_id" },
    date: DataTypes.DATEONLY,
    startTime: { type: DataTypes.TIME, field: "start_time" },
    endTime: { type: DataTypes.TIME, field: "end_time" },
    capacity: DataTypes.INTEGER,
    remaining: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "fastrider_slots",
    underscored: true,
  },
);
