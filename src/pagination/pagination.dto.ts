import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsNumber } from "class-validator";
import { number } from "joi";

export class PaginationDto {
  @ApiProperty({
    description: 'Page Number',
    example: 3,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => number)
  page: number;

  @ApiProperty({
    description: 'Page Size',
    example: 3,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  @Type(() => number)
  pageSize: number;

  constructor(page: number = 1, pageSize: number = 1) {
    this.page = page;
    this.pageSize= pageSize;
  }
}