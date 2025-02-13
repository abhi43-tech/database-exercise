import { Injectable } from '@nestjs/common';
import * as excelJs from 'exceljs';
import { InjectRepository } from '@nestjs/typeorm';
import { Countries } from '../../country/entity/country.entity';
import { In, Repository } from 'typeorm';
import { MonthService } from './month.service';

@Injectable()
export class ExcelService {
  constructor(
    private readonly monthService: MonthService,
    @InjectRepository(Countries) private countryRepo: Repository<Countries>,
  ) {}

  // Prepare data for excel file
  public async get(year?: number, countryCode?: string[]) {
    const data = await this.monthService.get();
    let filterData = year
      ? data.filter((values) => values.month.includes(year.toString()))
      : data;

    let countryData = await this.countryRepo.find({select: ['name', 'code']});
    const filteredCountries = countryCode
      ? countryData
          .filter(({ code }) => countryCode.includes(code))
          .map(({ name }) => name)
      : Array.from(new Set(countryData.map((record) => record.name)));

    if (countryCode) {
      filterData = filterData.filter((values) =>
        filteredCountries.includes(values.name),
      );
    }
    return await this.getWorkbook(filterData);
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
