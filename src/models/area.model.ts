import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/sequelize";

export class Area extends Model {}

Area.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
  },
  {
    sequelize,
    tableName: "areas",
    underscored: true,
  },
);
