import { UsePipes, ValidationPipe } from "@nestjs/common";
import { IsDateString, IsNotEmpty, IsNumber, IsString, Matches, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class createData {
  @ApiProperty({
    description: 'Date must be in YYYY-MM-DD format.',
    example: '2025-01-01',
    type: String,
  })
  @Matches(/^\d{4}-\d{1,2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format.',
  })
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'The number of confirmed cases.',
    example: 1000,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  confirmed: number;

  @ApiProperty({
    description: 'The number of deaths.',
    example: 1000,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  deaths: number;

  @ApiProperty({
    description: 'The number of recovered cases.',
    example: 1000,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  recovered: number;
}

@UsePipes(new ValidationPipe())
export class createTimeseries {

  @ApiProperty({
    description: 'The country of the timeseries entry.',
    example: 'India',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The data for the timeseries.',
    type: [createData], 
  })
  @ValidateNested()
  @Type(() => createData)
  data: createData[];
}

export class updateTimeseries {

  @ApiProperty({
    description: 'The name if the country.',
    example: 'India',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Date must be in YYYY-MM-DD format and unique.',
    example: '2025-01-01',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'The number of confirmed cases.',
    example: 1000,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  confirmed: number;

  @ApiProperty({
    description: 'The number of deaths.',
    example: 1000,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  deaths: number;

  @ApiProperty({
    description: 'The number of recovered cases.',
    example: 1000,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  recovered: number;
}

export class deleteTimeseries {

  @ApiProperty({
    description: 'The name if the country.',
    example: 'India',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Start date for the range in YYYY-MM-DD format',
    example: '2025-12-31',
    type: String,
  })
  @Matches(/^\d{4}-\d{1,2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  @IsNotEmpty()
  from: string;
  
  @ApiProperty({
    description: 'End date for the range in YYYY-MM-DD format',
    example: '2025-12-31',
    type: String,
  })
  @Matches(/^\d{4}-\d{1,2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  @IsNotEmpty()
  to: string;
}