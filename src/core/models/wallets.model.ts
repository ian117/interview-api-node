import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';

import { Users } from 'src/core/models/users.model';

@Table({
  tableName: 'wallets',
  modelName: 'Wallets',
  underscored: true,
  timestamps: true,
})
export class Wallets extends Model<Wallets> {
  @PrimaryKey
  @ForeignKey(() => Users)
  @Column(DataType.UUID)
  user_id: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL)
  balance: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  /* Associations */

  @BelongsTo(() => Users, 'user_id')
  user: Users;
}
