import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
  BelongsToMany,
  AllowNull,
} from 'sequelize-typescript';

import { Users } from 'src/core/models/users.model';
import { UsersOpportunitiesPivot } from 'src/core/models/users-opportunities.model';

@Table({
  tableName: 'opportunities',
  modelName: 'Opportunities',
  underscored: true,
  timestamps: true,
})
export class Opportunities extends Model<Opportunities> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(254))
  title: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL)
  total_amount: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  /* Associations */

  @BelongsToMany(() => Users, () => UsersOpportunitiesPivot, 'opportunity_id')
  users: Users[];
}
