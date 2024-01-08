import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
  CreatedAt,
  UpdatedAt,
  HasOne,
  BelongsToMany,
} from 'sequelize-typescript';
import { Opportunity } from './opportunities.model';
import { UsersOpportunitiesPivot } from './users-opportunities.model';
import { Wallet } from './wallet.model';

@Table({
  tableName: 'users',
  modelName: 'Users',
  underscored: true,
  timestamps: true,
})
export class Users extends Model<Users> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @Column(DataType.STRING(254))
  email: string;

  @Column(DataType.STRING(254))
  password: string;
  @Column(DataType.STRING(254))
  first_name: string;

  @Column(DataType.STRING(254))
  last_name: string;

  @Column(DataType.STRING(254))
  address: string;

  @Column(DataType.STRING(254))
  birthdate: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  /* Associations */

  @BelongsToMany(() => Opportunity, () => UsersOpportunitiesPivot, 'user_id')
  investments: Opportunity[];

  @HasOne(() => Wallet, 'user_id')
  wallet: Wallet;
}
