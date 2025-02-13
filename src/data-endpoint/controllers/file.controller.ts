import { Controller, Get, Query, Res } from '@nestjs/common';
import { ExcelService } from '../services/file.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('file')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  /**
   * Download excel file
   * allow filter by specific year or ISO code
   * multiple countries can be filter at a time
   *
   * @param res
   * @param year
   * @param code
   */
  @Get()
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
