import { ApiProperty } from '@nestjs/swagger';
import { IsISO31661Alpha2, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { string } from 'joi';

export class createCountry {

  @ApiProperty({
    description: "The name of the Country.",
    example: "India",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  country: string;
  
  @ApiProperty({
    description: "The flag of the country.",
    example: "IN",
    type: String,
    maxLength: 2,
  })
  @IsString()
  @MaxLength(2)
  @IsNotEmpty()
  flag: string;

  @ApiProperty({
    description: "The code of the country, use 2-Digit code. It must be Unique.",
    example: "IN",
    type: String,
    maxLength: 2,
  })
  @IsString()
  @MaxLength(2)
  @IsNotEmpty()
  @IsISO31661Alpha2()
  code: string;
}

export class updateCountry {
  @ApiProperty({
    description: 'The name of the country',
    example: 'India',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  country?: string;
  
  @ApiProperty({
    description: 'The flag of the country',
    example: 'IN',
    type: String,
    required: false,
  })
  @IsString()
  @MaxLength(2)
  @IsOptional()
  @IsNotEmpty()
  flag?: string;

  @ApiProperty({
    description: 'The code of the country, use only 2-digit code',
    example: 'IN',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsISO31661Alpha2()
  code?: string;
}