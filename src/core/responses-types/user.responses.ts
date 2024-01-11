import { ApiProperty } from '@nestjs/swagger';

export class GetUserMe {
  @ApiProperty({ example: 'UUID' })
  id: string;

  @ApiProperty({ example: 'Jonh' })
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  last_name: string;

  @ApiProperty({ example: 'example@academlo.com' })
  email: string;

  @ApiProperty({ example: '23-07-23T06:00:00.000Z' })
  birthdate: string;

  @ApiProperty({ example: 'Mexico Address' })
  address: string;

  @ApiProperty({ example: '2020-09-19T18:37:44.190Z' })
  created_at: string;

  @ApiProperty({ example: '2020-09-19T18:37:44.190Z' })
  updated_at: string;

  @ApiProperty({
    example: {
      user_id: 'UUID',
      balance: '1000',
      created_at: '2020-09-19T18:37:44.190Z',
      updated_at: '2020-09-19T18:37:44.190Z',
    },
  })
  wallet: object;
}
