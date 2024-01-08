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
} from 'sequelize-typescript';
import { Users } from './users.model';
import { UsersOpportunitiesPivot } from './users-opportunities.model';

@Table({
  tableName: 'opportunity',
  modelName: 'Opportunity',
  underscored: true,
  timestamps: true,
})
export class Opportunity extends Model<Opportunity> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @Column(DataType.STRING(254))
  title: string;

  @Column(DataType.DECIMAL())
  total_amount: number;

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

  @BelongsToMany(() => Users, () => UsersOpportunitiesPivot, 'opportunity_id')
  Users: Users[];
}
