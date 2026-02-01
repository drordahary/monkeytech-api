import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../db/sequelize";

export class AuthCode extends Model<
  InferAttributes<AuthCode>,
  InferCreationAttributes<AuthCode>
> {
  declare id: CreationOptional<string>;
  declare phone: string;
  declare codeHash: string;
  declare expiresAt: Date;
  declare consumedAt: CreationOptional<Date | null>;
}

AuthCode.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    phone: { type: DataTypes.STRING(32), allowNull: false },
    codeHash: {
      type: DataTypes.STRING(128),
      field: "code_hash",
      allowNull: false,
    },
    expiresAt: { type: DataTypes.DATE, field: "expires_at", allowNull: false },
    consumedAt: { type: DataTypes.DATE, field: "consumed_at", allowNull: true },
  },
  {
    sequelize,
    tableName: "auth_codes",
    underscored: true,
  },
);
