

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
  code: string;
}

export class updateCountry {

  @IsString()
  @IsNotEmpty()
  country: string;
  
  @IsString()
  @MaxLength(2)
  flag?: string;

  @IsString()
  @MaxLength(2)
  code?: string;
}