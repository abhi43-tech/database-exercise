import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Countries } from 'src/entity/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSeries } from 'src/entity/timeseries.entity';
import { dateDto } from 'src/dto/date.dto';
import { allData } from 'src/dto/alldata.dto';
import { TotalService } from '../Endpoint 2/total.service';
import { Recoverable } from 'repl';

@Injectable()
export class CaseService {
  constructor(
    @InjectRepository(Countries) private countryRepo: Repository<Countries>,
    @InjectRepository(TimeSeries)
    private timeseriesRepo: Repository<TimeSeries>,
    private readonly totalService: TotalService,
  ) {}

  public async getData(): Promise<allData[]> {
    return await this.totalService.getData();
  }

  public async getFilterData(date: dateDto) {
    let result: allData[] = [];
    const fromDate = date.from ? this.parseDate(date.from) : null;
    const toDate = date.to ? this.parseDate(date.to) : null;

    const filteredCountries = Array.from(
      new Set((await this.timeseriesRepo.find()).map((data) => data.name)),
    );

    const filterData = await Promise.all(
      filteredCountries.map(async (country) => {
        const records = await this.timeseriesRepo.find({
          where: { name: country },
        });
        const filteredRecords = records.filter((record) => {
          const recordDate = this.parseDate(record.date)?.getTime();
          return (
            (!fromDate || recordDate >= fromDate.getTime()) &&
            (!toDate || recordDate <= toDate.getTime())
          );
        });
        return filteredRecords;
      }),
    );

    for (let i = 0; i < filteredCountries.length; i++) {
      const data = filterData
        .flat()
        .filter((record) => record.name === filteredCountries[i]);
      const totals = data.reduce(
        (acc, record) => {
          acc.confirmed += record.confirmed || 0;
          acc.deaths += record.deaths || 0;
          acc.recovered += record.recovered || 0;
          return acc;
        },
        { confirmed: 0, deaths: 0, recovered: 0 },
      );
      result.push({
        country: filteredCountries[i],
        confirmed: totals.confirmed,
        deaths: totals.deaths,
        recovered: totals.recovered,
      });
    }

    return result;
  }

  public async getByNumber(greater?: number, date?: dateDto, less?: number) {
    const data = date ? await this.getFilterData(date) : await this.getData();
    let filterData;
    if (greater && less) {
      filterData = data.filter((record) => {
        const recover = record['recovered'];
        if (recover > greater && recover < less) return true;
        return false;
      });
      return filterData;
    }
    filterData = less
      ? data.filter((record) => {
          const recover = record['recovered'];
          if (less && recover < less) return true;
          return false;
        })
      : data.filter((record) => {
          const recover = record['recovered'];
          if (greater && recover > greater) return true;
          return false;
        });

    return filterData;
  }

  private parseDate(date: string) {
    let time = new Date(date).getTime();
    let date_ = new Date(date).getDate();
    let year = new Date(date).getFullYear();
    let month = new Date(date).getMonth() + 1;
    if (isNaN(time) || !date_ || !month || !year)
      throw new BadRequestException('Given Date is not valid');

    return new Date(date);
  }
}
