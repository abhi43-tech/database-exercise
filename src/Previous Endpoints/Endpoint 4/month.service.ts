import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSeries } from 'src/entity/timeseries.entity';
import { dateDto } from 'src/dto/date.dto';
import { monthDto } from 'src/dto/month.dto';

@Injectable()
export class MonthService {
  constructor(
    @InjectRepository(TimeSeries) private timeRepo: Repository<TimeSeries>,
  ) {}

  public async getMonthlyCases() {
    const countries = Array.from(
      new Set((await this.timeRepo.find()).map((record) => record.name)),
    );
    let result: monthDto[] = [];

    for (let country of countries) {
      const countryData = await this.timeRepo.find({
        where: { name: country },
      });
      let total = { confirmed: 0, deaths: 0, recovered: 0 };
      let currentMonth = this.parseDate(countryData[0]['date']).getMonth();
      let currentYear = this.parseDate(countryData[0]['date']).getFullYear();

      for (let entry of countryData) {
        let entryDate = this.parseDate(entry['date']);
        let entryMonth = entryDate.getMonth();
        let entryYear = entryDate.getFullYear();

        if (entryMonth !== currentMonth || entryYear !== currentYear) {
          result.push({
            country,
            month: currentMonth,
            year: currentYear,
            data: { ...total },
          });
          currentMonth = entryMonth;
          currentYear = entryYear;
          total = { confirmed: 0, deaths: 0, recovered: 0 };
        }

        total.confirmed += entry['confirmed'] ?? 0;
        total.deaths += entry['deaths'] ?? 0;
        total.recovered += entry['recovered'] ?? 0;
      }

      result.push({
        country,
        month: currentMonth,
        year: currentYear,
        data: { ...total },
      });
    }
    return result;
  }

  public async getByDate(date: dateDto) {
    const fromDate = this.parseDate(date.from);
    const toDate = this.parseDate(date.to);

    if (fromDate.getTime() > toDate.getTime()) {
      throw new BadRequestException(
        `Enter a 'To' date greater than the 'From' date.`,
      );
    }

    const data = await this.getMonthlyCases();
    let result: monthDto[] = [];

    result = data.filter((record) => {
      return (
        fromDate.getMonth() <= Number(record.month) &&
        Number(record.month) <= toDate.getMonth() && 
        fromDate.getFullYear() <= Number(record.year) &&
        Number(record.year) <= toDate.getFullYear()
      );
    });

    return result;
  }

  public async getByNumbers(
    greater?: number,
    date?: dateDto,
    less?: number,
  ) {
    let data = date ? await this.getByDate(date) :await this.getMonthlyCases();
    let filterData;
    if (greater && less) {
      filterData = Object.entries(data).filter((item) => {
        const recover = item[1]['data']['recovered'];
        if (recover >= greater && recover <= less) return true;
        return false;
      });
      return filterData;
    }
    filterData = less
      ? Object.entries(data).filter((item) => {
          const recover = item[1]['data']['recovered'];
          if (less && recover <= less) return true;
          return false;
        })
      : Object.entries(data).filter((item) => {
          const recover = item[1]['data']['recovered'];
          if (greater && recover >= greater) return true;
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
