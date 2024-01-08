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
} from 'sequelize-typescript';

import { Users } from './users.model';

@Table({
  tableName: 'wallet',
  modelName: 'Wallet',
  underscored: true,
  timestamps: true,
})
export class Wallet extends Model<Wallet> {
  @PrimaryKey
  @ForeignKey(() => Users)
  @Column(DataType.UUID)
  user_id: string;

  @Column(DataType.DECIMAL)
  balance: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  /* Associations */

  @BelongsTo(() => Users)
  user: Users;
}
