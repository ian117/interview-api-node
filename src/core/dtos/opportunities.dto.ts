import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class opportunityParamsDTO {
  @ApiProperty({
    example: 'fd914b72-a423-4256-99a1-aff78da9281f',
    description: `ID of the Opportunity`,
    required: true,
  })
  @IsUUID('4')
  readonly id: string;
}
