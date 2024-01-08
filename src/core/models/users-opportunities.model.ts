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
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { Users } from './users.model';
import { Opportunity } from './Opportunities.model';

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
  @ForeignKey(() => Opportunity)
  @Column(DataType.UUID)
  opportunity_id: string;

  @Column(DataType.DECIMAL())
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

  @BelongsTo(() => Users)
  user: Users;

  @BelongsTo(() => Opportunity)
  opportunity: Opportunity;
}
