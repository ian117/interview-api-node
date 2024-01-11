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
  AllowNull,
} from 'sequelize-typescript';

import { Opportunities } from 'src/core/models/opportunities.model';
import { UsersOpportunitiesPivot } from 'src/core/models/users-opportunities.model';
import { Wallets } from 'src/core/models/wallets.model';

@Table({
  tableName: 'users',
  modelName: 'Users',
  underscored: true,
  timestamps: true,
  scopes: {
    me_view: {
      attributes: { exclude: ['password'] },
    },
  },
})
export class Users extends Model<Users> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(254))
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING(254))
  password: string;

  @AllowNull(false)
  @Column(DataType.STRING(254))
  first_name: string;

  @AllowNull(false)
  @Column(DataType.STRING(254))
  last_name: string;

  @AllowNull(false)
  @Column(DataType.STRING(254))
  address: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  birthdate: Date;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  /* Associations */

  @BelongsToMany(() => Opportunities, () => UsersOpportunitiesPivot, 'user_id')
  investments: Opportunities[];

  @HasOne(() => Wallets, 'user_id')
  wallet: Wallets;
}
