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
  @IsNotEmpty()
  @MaxLength(254)
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  password: string;
}

export class SignUpDTO {
  @IsNotEmpty()
  @MaxLength(254)
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;

  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  address: string;

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
