import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize";

export class Location extends Model {
  declare id: string;
  declare areaId: string;
  declare name: string;
  declare type: "ATTRACTION" | "FOOD" | "RESTAURANT";
  declare supportsFastrider: boolean;
  declare rating: number;
  declare avgWaitTime: number;
}

Location.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    areaId: {
      type: DataTypes.UUID,
      field: "area_id",
    },
    name: DataTypes.STRING,
    type: DataTypes.ENUM("ATTRACTION", "FOOD", "RESTAURANT"),
    supportsFastrider: {
      type: DataTypes.BOOLEAN,
      field: "supports_fastrider",
    },
    rating: DataTypes.FLOAT,
    avgWaitTime: {
      type: DataTypes.INTEGER,
      field: "avg_wait_time",
    },
  },
  {
    sequelize,
    tableName: "locations",
    underscored: true,
  },
);
