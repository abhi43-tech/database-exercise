import { Controller, Get, Query, Res } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

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
  async getData(
    @Res() res,
    @Query('year') year?: number,
    @Query('code') code?: string[],
  ) {
    let workbook = await this.excelService.getData(year, code);

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
