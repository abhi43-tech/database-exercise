import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DateDto {
  @ApiProperty({
    description: 'Start date in YYYY-MM-DD format',
    example: '2020-1-01',
    type: String,
    required: true,
  })
  @Matches(/^\d{4}-\d{1,2}-\d{1,2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  @IsNotEmpty()
  @IsOptional()
  from: string;

  @ApiProperty({
    description: 'Start date in YYYY-MM-DD format',
    example: '2020-1-30',
    type: String,
    required: true,
  })
  @Matches(/^\d{4}-\d{1,2}-\d{1,2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  @IsNotEmpty()
  @IsOptional()
  to: string;
}
