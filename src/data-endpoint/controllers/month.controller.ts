import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MonthService } from '../services/month.service';
import { DateDto } from '../dto/date.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('month')
export class MonthController {
  constructor(private readonly monthService: MonthService) {}

  /**
   * Response contains total confirmed, total deaths, total recovered for each month for each country
   * allow filter by date and total confirmed case is greater or less than a number
   *
   * @param from
   * @param to
   * @param greater
   * @param less
   * @returns
   */
  @Get()
  @UsePipes(new ValidationPipe())
  @ApiQuery({
    name: 'from',
    description: 'Start date in YYYY-MM-DD format',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'to',
    description: 'End date in YYYY-MM-DD format',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'less',
    description: 'Filter cases with number less than this value',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'greater',
    description: 'Filter cases with number greater than this value',
    required: false,
    type: Number,
  })
  async get(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('greater') greater?: number,
    @Query('less') less?: number,
  ) {
    if (from && to && new Date(from) > new Date(to)) {
      throw new BadRequestException(
        '"from" date cannot be greater than "to" date.',
      );
    }

    const date: DateDto = { from, to };
    return await this.monthService.get(greater, date, less);
  }
}
