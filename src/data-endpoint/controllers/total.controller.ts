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
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { TotalService } from '../services/total.service';

@Controller('overview')
export class TotalController {
  constructor(private readonly totalService: TotalService) {}

  /**
   * Response contains total confirmed, total deaths, total recovered for each country
   * allow filter by date and ISO code
   *
   * @param from
   * @param to
   * @param iso
   * @returns
   */
  @Get()
  @UsePipes(new ValidationPipe())
  @ApiQuery({
    name: 'from',
    description: 'Enter date in this formate YYYY-MM-DD',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'to',
    description: 'Enter date in this formate YYYY-MM-DD',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'iso',
    description: 'Enter iso code',
    required: false,
    type: String,
  })
  get(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('iso') iso?: string,
  ) {
    if (from && to && new Date(from) > new Date(to)) {
      throw new BadRequestException(
        '"from" date cannot be greater than "to" date.',
      );
    }

    const date: DateDto = { from, to };
    if (date.from || date.to || iso) return this.totalService.filter(date, iso);
    return this.totalService.get();
  }
}
