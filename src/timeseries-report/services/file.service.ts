import { Injectable } from '@nestjs/common';
import * as excelJs from 'exceljs';
import { TimeseriesRepository } from 'src/timeseries/repository/timeseries.repo';

@Injectable()
export class ExcelService {
  constructor(
    private timeseiresRepo: TimeseriesRepository,
  ) {}

  // Prepare data for excel file
  public async get(year?: number, countryCodes?: string[]) {
    const query = await this.timeseiresRepo
      .createQueryBuilder('timeseries')
      .select('country.name', 'name')
      .addSelect("DATE_FORMAT(timeseries.date, '%Y-%m')", 'month')
      .addSelect('SUM(timeseries.confirmed)', 'total_confirmed')
      .addSelect('SUM(timeseries.deaths)', 'total_deaths')
      .addSelect('SUM(timeseries.recovered)', 'total_recovered')
      .innerJoin('timeseries.country', 'country')
      .groupBy('country.name')
      .addGroupBy("DATE_FORMAT(timeseries.date, '%Y-%m')");

    if (year) {
      query.andWhere("DATE_FORMAT(timeseries.date, '%Y') = :year", { year });
    }

    if (countryCodes && countryCodes.length > 0) {
      if (!Array.isArray(countryCodes)) {
        countryCodes = [countryCodes];
      }
      query.andWhere('country.code IN (:...countryCodes)', { countryCodes });
    }

    const result = await query.getRawMany();
    return await this.getWorkbook(result);
  }

  // Return excel file with data
  private async getWorkbook(data) {
    const workbook = new excelJs.Workbook();
    const sheet = workbook.addWorksheet('Covid data');

    sheet.columns = [
      { header: 'Country', key: 'country', width: 20 },
      { header: 'Month', key: 'month', width: 10 },
      { header: 'Confirmed', key: 'confirmed', width: 15 },
      { header: 'Deaths', key: 'deaths', width: 15 },
      { header: 'Recovered', key: 'recovered', width: 15 },
    ];

    for (const values of data) {
      sheet.addRow({
        country: values.name,
        month: values.month,
        confirmed: values.total_confirmed,
        deaths: values.total_deaths,
        recovered: values.total_recovered,
      });
    }

    return await workbook;
  }
}
