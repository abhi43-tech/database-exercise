import { Body, Controller, Get, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { dateDto } from "src/dto/date.dto";
import { CaseService } from "./cases.service";

@Controller('cases')
export class CaseController {
  constructor(private readonly totalService: CaseService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  getData(@Body() date: dateDto, @Query('iso') iso?: string) {
    if(date || iso) return this.totalService.getFilterData(date, iso)
    return this.totalService.getData()
  }
}