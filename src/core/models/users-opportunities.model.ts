import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Users } from 'src/core/models/users.model';
import { Opportunities } from 'src/core/models/opportunities.model';

@Table({
  tableName: 'users_opportunities',
  modelName: 'UsersOpportunitiesPivot',
  underscored: true,
  timestamps: true,
})
export class UsersOpportunitiesPivot extends Model<UsersOpportunitiesPivot> {
  @PrimaryKey
  @ForeignKey(() => Users)
  @Column(DataType.UUID)
  user_id: string;

  @PrimaryKey
  @ForeignKey(() => Opportunities)
  @Column(DataType.UUID)
  opportunity_id: string;

  @Column(DataType.DECIMAL)
  investment_amount: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deleted_at: Date;

  /* Associations */

  @BelongsTo(() => Users, 'user_id')
  user: Users;

  @BelongsTo(() => Opportunities, 'opportunity_id')
  opportunity: Opportunities;
}
