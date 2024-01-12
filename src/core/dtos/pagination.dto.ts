import { IsEmpty, IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationQueryDTO {
  @ApiProperty({
    type: Number,
    description:
      'Number of page in the pagination. 0 and 1 are the same. It goes 1, then 2, then 3',
    example: '1',
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Max number of results per page',
    example: '10',
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  size: number;

  // SugarSyntax in next parts of the code with TS
  @IsEmpty()
  limit: number;
  @IsEmpty()
  offset: number;
}
