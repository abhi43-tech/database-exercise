import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DateDto } from './dto/date.dto';
import { ApiQuery } from '@nestjs/swagger';
import { TimeseriesReportService } from './services/timeseries-report.service';
import { ExcelService } from './services/file.service';

@Controller('report/timeseries')
export class TimseriesReportController {
  constructor(
    private readonly timeseriesReport: TimeseriesReportService,
    private readonly excelService: ExcelService,
  ) {}

  /**
   * Response contains total confirmed, total deaths, total recovered for each country
   * allow filter by date and ISO code
   *
   * @param from
   * @param to
   * @param iso
   * @returns
   */
  @Get('overview')
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
  getOverview(
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
    return this.timeseriesReport.getTotalCases(date, iso);
  }

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
  @Get('country-wise')
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
  getCountryCases(
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

    return this.timeseriesReport.getCountryCases(date, greater, less);
  }

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
  @Get('monthly-cases')
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
    return await this.timeseriesReport.getMonthlyCases(greater, date, less);
  }

  /**
   * Gives top N countries with highest total confirmed cases
   *
   * @param top
   * @param from
   * @param to
   * @returns
   */
  @Get('top-countries')
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
  getReport(
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
    return this.timeseriesReport.getCountryCases(
      date,
      null,
      null,
      top ? top : 2,
    );
  }

  /**
   * Download excel file
   * allow filter by specific year or ISO code
   * multiple countries can be filter at a time
   *
   * @param res
   * @param year
   * @param code
   */
  @Get('export/excel')
  @ApiQuery({
    name: 'year',
    description: 'Get the Data for specific year',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'code',
    description: 'Get the Data by thier ISO code',
    required: false,
    type: [String],
  })
  async get(
    @Res() res,
    @Query('year') year?: number,
    @Query('code') code?: string[],
  ) {
    let workbook = await this.excelService.get(year, code);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment;filename=' + 'total_cases.xlsx',
    );

    workbook.xlsx.write(res);
  }
}
