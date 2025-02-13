import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DateDto } from '../dto/date.dto';
import { ApiQuery } from '@nestjs/swagger';
import { TopService } from '../services/top.service';

@Controller('top')
export class TopController {
  constructor(private readonly topService: TopService) {}

  /**
   * Gives top N countries with highest total confirmed cases
   *
   * @param top
   * @param from
   * @param to
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
    name: 'top',
    description: 'Filter top N countries by Confirmed cases',
    required: false,
    type: Number,
  })
  get(
    @Query('top') top: number,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (top && top > 15)
      throw new BadRequestException('Do not ask more than 15 countries.');

    if (from && to && new Date(from) > new Date(to))
      throw new BadRequestException(
        '"from" date cannot be greater than "to" date.',
      );

    const date: DateDto = { from, to };
    return this.topService.get(top, date);
  }
}
