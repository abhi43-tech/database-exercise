import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TopService } from './top.service';
import { dateDto } from 'src/dto/date.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('top')
export class TopController {
  constructor(private readonly topService: TopService) {}

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
    name: 'top',
    description: 'Filter top N countries by Confirmed cases',
    required: false,
    type: Number,
  })
  getData(
    @Query('top') top: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
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
    return this.topService.getTopData(top, date);
  }
  private isValidDate(date: string): boolean {
    const regex = /^\d{4}-\d{1,2}-\d{2}$/;
    return regex.test(date);
  }
}
