import { Injectable } from '@nestjs/common';
import * as excelJs from 'exceljs';
import { MonthService } from '../Endpoint 4/month.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Countries } from 'src/entity/country.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ExcelService {
  constructor(
    private readonly monthService: MonthService,
    @InjectRepository(Countries) private countryRepo: Repository<Countries>,
  ) {}

  public async getData(year?: number, countryCode?: string[]) {
    const data = await this.monthService.getMonthlyCases();
    let filterData = year
      ? data.filter((values) => values.year === Number(year))
      : data;

    let countryData = await this.countryRepo.find()
    
      const filteredCountries = countryCode
      ? countryData.filter(({ code }) => countryCode.includes(code)).map(
          ({ country }) => country,
        )
      : Array.from(new Set(countryData.map((record) => record.country)));

      if(countryCode){filterData = filterData.filter((values) =>
        filteredCountries.includes(values.country),
      );}

    return await this.getWorkbook(filterData);
  }

  private async getWorkbook(data) {
    const workbook = new excelJs.Workbook();
    const sheet = workbook.addWorksheet('Total Cases');

    sheet.columns = [
      { header: 'Country', key: 'country', width: 20 },
      { header: 'Month', key: 'month', width: 10 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Confirmed', key: 'confirmed', width: 15 },
      { header: 'Deaths', key: 'deaths', width: 15 },
      { header: 'Recovered', key: 'recovered', width: 15 },
    ];

    for (const values of data) {
      sheet.addRow({
        country: values.country,
        month: values.month,
        year: values.year,
        confirmed: values.data.confirmed,
        deaths: values.data.deaths,
        recovered: values.data.recovered,
      });
    }

    return await workbook;
  }

  private async getCountriesByCodes(codes: string[]): Promise<Countries[]> {
    if (!Array.isArray(codes) || codes.length === 0) {
      throw new Error('Codes must be a non-empty array');
    }

    return await this.countryRepo.find({ where: { code: In(codes) } });
  }
}
