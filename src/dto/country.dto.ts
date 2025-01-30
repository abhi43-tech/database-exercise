import { IsISO31661Alpha2, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

export class createCountry {

  @IsString()
  @IsNotEmpty()
  country: string;
  
  @IsString()
  @MaxLength(2)
  @IsNotEmpty()
  flag: string;

  @IsString()
  @MaxLength(2)
  @IsNotEmpty()
  @IsISO31661Alpha2()
  code: string;
}

export class updateCountry {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  country?: string;
  
  @IsString()
  @MaxLength(2)
  @IsOptional()
  @IsNotEmpty()
  flag?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsISO31661Alpha2()
  code?: string;
}