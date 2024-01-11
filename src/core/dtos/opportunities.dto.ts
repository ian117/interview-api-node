import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
} from 'class-validator';

export class OpportunityParamsDTO {
  @ApiProperty({
    example: 'fd914b72-a423-4256-99a1-aff78da9281f',
    description: `ID of the Opportunity`,
    required: true,
  })
  @IsUUID('4')
  readonly id: string;
}

export class CreateOpportunityDTO {
  @ApiProperty({
    example: 'X (Formerly Twitter)',
    description: `Name of the opportunity`,
    required: true,
  })
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  readonly title: string;

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
