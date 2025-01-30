import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Countries } from 'src/entity/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSeries } from 'src/entity/timeseries.entity';
import { allData } from '../../dto/alldata.dto';
import { dateDto } from 'src/dto/date.dto';

@Injectable()
export class TotalService {
  constructor(
    @InjectRepository(Countries) private countryRepo: Repository<Countries>,
    @InjectRepository(TimeSeries)
    private timeseriesRepo: Repository<TimeSeries>,
  ) {}

  public async getData(): Promise<allData[]> {
    let result: allData[] = [];

    const countries = Array.from(
      new Set((await this.timeseriesRepo.find()).map((data) => data.name)),
    );

    for (let i = 0; i < countries.length; i++) {
      const data = await this.timeseriesRepo.find({
        where: { name: countries[i] },
      });
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
        country: countries[i],
        confirmed: totals.confirmed,
        deaths: totals.deaths,
        recovered: totals.recovered,
      });
    }

    return result;
  }

  public async getFilterData(date?: dateDto, iso?: string){
    const fromDate = date.from ? this.parseDate(date.from) : null;
    const toDate = date.to ? this.parseDate(date.to) : null;

    const filteredCountries = iso
      ? [await this.countryRepo.findOne({ where: { code: iso } })].map(
          ({ country }) => country,
        )
      : Array.from(
          new Set((await this.timeseriesRepo.find()).map((data) => data.name)),
        );

    const result = await Promise.all(filteredCountries.map(async (country) => {
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
    }));

    return result
  }

  private parseDate(date: string) {
      let time = new Date(date).getTime();
      let date_ = new Date(date).getDate();
      let year = new Date(date).getFullYear();
      let month = new Date(date).getMonth() + 1;
      if (isNaN(time) || !date_ || !month || !year)
        throw new BadRequestException('Given Date is not valid');

      return new Date(date)
    }
}
