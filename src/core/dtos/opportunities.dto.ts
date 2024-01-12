import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { PaginationQueryDTO } from './pagination.dto';
import { ORDER_OPTIONS } from '../constants/constants';
import { IsBiggerThan } from './custom-validators.dto';

export class addInvestmentBodyDTO {
  @ApiProperty({
    example: '1000',
    description: `Amount to invest`,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Max(100000000, {
    message: 'Amount must not be greater than one hundred million',
  })
  readonly amount: string;
}

export class OpportunityParamsDTO {
  @ApiProperty({
    example: 'fd914b72-a423-4256-99a1-aff78da9281f',
    description: `ID of the Inversion Opportunity`,
    required: true,
  })
  @IsUUID('4')
  readonly id: string;
}

export class CreateOpportunityDTO {
  @ApiProperty({
    example: 'X (Formerly Twitter)',
    description: `Title of the Inversion Opportunity`,
    required: true,
  })
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: 10000,
    description: `Max total amount of the Inversion Opportunity`,
    required: true,
  })
  @Type(() => Number)
  @IsNumber()
  @Max(100000000, {
    message: 'total_amount must not be greater than one hundred million',
  })
  @IsPositive()
  readonly total_amount: string;
}

// ALL Keys in CreateDTO now are optionall
export class UpdateOpportunityDto extends PartialType(CreateOpportunityDTO) {}

export class FilterOpportunitiesQueryDto extends PaginationQueryDTO {
  @ApiProperty({
    example: '620fabb9-b1aa-4126-8861-ded4827e6999',
    description: `UUID of the Inversion Opportunity`,
    required: false,
  })
  @IsUUID('4')
  @IsOptional()
  readonly id: string;

  @ApiProperty({
    example: 'X (Formerly Twitter)',
    description: `Title of the Inversion Opportunity`,
    required: false,
  })
  @IsString()
  @MaxLength(254)
  @IsOptional()
  readonly title: string;

  @ApiProperty({
    example: '40000',
    description: `Search between values for the total amount`,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly total_amount_between_1: number;

  @ApiProperty({
    example: '40000',
    description: `Search between values for the total amount. This value needs to be greater than total_amount_between_1`,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  @IsBiggerThan('total_amount_between_1', {
    message: 'This must be grater than total_amount_between_1',
  })
  readonly total_amount_between_2: number;

  @ApiProperty({
    example: 'ASC',
    description: `Order for the total amount: ${ORDER_OPTIONS}`,
    required: false,
  })
  @IsString()
  @MaxLength(254)
  @IsIn(ORDER_OPTIONS)
  @IsOptional()
  readonly total_amount_order: string;

  @ApiProperty({
    example: 'ASC',
    description: `Order for the Created At: ${ORDER_OPTIONS}`,
    required: false,
  })
  @IsString()
  @MaxLength(254)
  @IsIn(ORDER_OPTIONS)
  @IsOptional()
  readonly created_at_order: string;
}
