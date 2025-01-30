import { Body, Controller, Get, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { TotalService } from "./total.service";
import { dateDto } from "src/dto/date.dto";

@Controller('total')
export class TotalController {
  constructor(private readonly totalService: TotalService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  getData(@Body() date?: dateDto, @Query('iso') iso?: string) {
    if(date || iso) return this.totalService.getFilterData(date, iso)
    return this.totalService.getData()
  }
}