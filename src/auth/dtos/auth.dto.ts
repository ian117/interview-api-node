import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxDate,
  MaxLength,
  MinDate,
} from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    type: String,
    description: `Email saved on the database`,
  })
  @IsNotEmpty()
  @MaxLength(254)
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: `Password saved on the database`,
  })
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  password: string;
}

export class SignUpDTO {
  @ApiProperty({
    type: String,
    description: `Email saved on the database`,
  })
  @IsNotEmpty()
  @MaxLength(254)
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: `Password saved on the database`,
  })
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;

  @ApiProperty({
    type: String,
    description: `first name saved on the database`,
  })
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    type: String,
    description: `last name saved on the database`,
  })
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    type: String,
    description: `Address saved on the database`,
  })
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    type: String,
    description: `Birthdate saved on the database. Minimal date is 01-01-1920`,
    example: '2000-05-12',
  })
  @Type(() => Date)
  @MinDate(() => new Date('01-01-1920'), {
    message: () =>
      `minimal allowed date for birthday is ${new Date(
        '01-01-1920',
      ).toDateString()}`,
  })
  @IsNotEmpty()
  birthdate: Date;
}
