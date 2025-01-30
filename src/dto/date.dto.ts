import {  IsNotEmpty, IsOptional, Matches } from "class-validator";

export class dateDto {

  @Matches(/^\d{4}-\d{1,2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  @IsNotEmpty()
  @IsOptional() 
  from: string;

  @Matches(/^\d{4}-\d{1,2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  @IsNotEmpty()
  @IsOptional() 
  to: string;
}