import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TimeSeriesService } from './timeseries.service';
import {
  CreateTimeseries,
  DeleteTimeseries,
  UpdateTimeseries,
} from './dto/timeseries.dto';
import { PaginationDto } from '../pagination/dto/pagination.dto';

@Controller('timeseries')
export class TimeSeriesController {
  constructor(private readonly timeseriesService: TimeSeriesService) {}

  @Get()
  async get(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    const paginate: PaginationDto = { page: page, pageSize: pageSize };
    return await this.timeseriesService.get(paginate);
  }

  /**
   *  Create timeseries data for given country and date if not exist
   *  multiple records can be added
   *
   * @param data
   * @returns
   */
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() data: CreateTimeseries) {
    return await this.timeseriesService.create(data);
  }

  /**
   * Update timeseries data for specific country and date if exist
   *
   * @param data
   * @returns
   */
  @Put()
  @UsePipes(new ValidationPipe())
  async update(@Body() data: UpdateTimeseries) {
    return await this.timeseriesService.update(data);
  }

  /**
   * Delete data for specific date range for given country
   * @param data
   * @returns
   */
  @Delete()
  @UsePipes(new ValidationPipe())
  async delete(@Body() data: DeleteTimeseries) {
    return await this.timeseriesService.delete(data);
  }
}
