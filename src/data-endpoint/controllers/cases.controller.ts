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
import { TotalService } from '../services/total.service';
import { CaseService } from '../services/cases.service';

@Controller('cases')
export class CaseController {
  constructor(
    private readonly totalService: TotalService,
    private readonly casesService: CaseService,
  ) {}

  /**
   * Gives the total cofirmed, deaths and recoverd
   * allow to filter by date and ISO code
   *
   * @param from
   * @param to
   * @param less
   * @param greater
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
  get(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('less') less?: number,
    @Query('greater') greater?: number,
  ) {
    if (from && to && new Date(from) > new Date(to)) {
      throw new BadRequestException(
        '"from" date cannot be later than "to" date.',
      );
    }

    const date: DateDto = { from, to };
    if (greater || less || date)
      return this.casesService.filter(date, greater, less);

    return this.totalService.get();
  }
}
