import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MonthService } from './month.service';
import { dateDto } from 'src/dto/date.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('month')
export class MonthController {
  constructor(private readonly monthService: MonthService) {}

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
  async getMonthlyCases(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('greater') greater?: number,
    @Query('less') less?: number,
  ) {
    if (from && !this.isValidDate(from)) {
      throw new BadRequestException(
        'Invalid "from" date format. Use YYYY-MM-DD.',
      );
    }

    if (to && !this.isValidDate(to)) {
      throw new BadRequestException(
        'Invalid "to" date format. Use YYYY-MM-DD.',
      );
    }

    if (from && to && new Date(from) > new Date(to)) {
      throw new BadRequestException(
        '"from" date cannot be later than "to" date.',
      );
    }

    const date: dateDto = from && to ? { from, to } : null;
    if (greater || less)
      return this.monthService.getByNumbers(greater, date, less);
    if (!date) return this.monthService.getMonthlyCases();
    return await this.monthService.getByDate(date);
  }

  private isValidDate(date: string): boolean {
    const regex = /^\d{4}-\d{1,2}-\d{2}$/;
    return regex.test(date);
  }
}
