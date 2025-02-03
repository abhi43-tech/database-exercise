import { Body, Controller, Delete, Get, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { TimeSeriesService } from "./timeseries.service";
import { createTimeseries, deleteTimeseries, updateTimeseries } from "src/dto/timeseries.dto";
import { PaginationDto } from "src/pagination/pagination.dto";

@Controller('timeseries')
export class TimeSeriesController {

  constructor(private readonly timeseriesService: TimeSeriesService) {}

  @Get()
  async getTime(@Query("page") page: number, @Query('pageSize') pageSize: number) {
    const paginate: PaginationDto = {page: page, pageSize: pageSize}
    return await this.timeseriesService.getTime(paginate);
  }

  // 5th
  @Post()
  @UsePipes(new ValidationPipe())
  async createTimeseries(@Body() data: createTimeseries) {
    return await this.timeseriesService.createTimeseries(data);
  }

  // 6th
  @Put()
  @UsePipes(new ValidationPipe())
  async updateTimeseries(@Body() data: updateTimeseries) {
    return await this.timeseriesService.updateTimeseries(data);
  }

  // 7th
  @Delete()
  @UsePipes(new ValidationPipe())
  async deleteTime(@Body() data: deleteTimeseries) {
    return await this.timeseriesService.deleteTimeseries(data);
  }
}