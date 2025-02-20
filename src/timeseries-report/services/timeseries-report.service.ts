import { Injectable } from '@nestjs/common';
import { DateDto } from '../dto/date.dto';
import { TimeseriesRepository } from 'src/timeseries/repository/timeseries.repo';

@Injectable()
export class TimeseriesReportService {
  constructor(private readonly timeseriesRepo: TimeseriesRepository) {}

  // Response contains total confirmed, deaths, recoverd
  // filter by two dates and ISO code
  public async getCountryCases(
    date?: DateDto,
    greater?: number,
    less?: number,
    limit?: number,
  ) {
    // Query for sum all confirmed, deaths and recovered
    const query = await this.timeseriesRepo
      .createQueryBuilder('timeseries')
      .select('country.name', 'name')
      .addSelect('SUM(timeseries.confirmed)', 'total_confirmed')
      .addSelect('SUM(timeseries.deaths)', 'total_deaths')
      .addSelect('SUM(timeseries.recovered)', 'total_recovered')
      .innerJoin('timeseries.country', 'country');

    // filter data for given range of date
    if (date.from != undefined) {
      const fromDate = new Date(date.from);
      const toDate = new Date(date.to);
      query.where('DATE(timeseries.date) BETWEEN :from AND :to', {
        from: fromDate,
        to: toDate,
      });
    }

    // Return data which have greater value compare to 'greater'
    if (greater) {
      query.andHaving('SUM(timeseries.confirmed) >= :greater', { greater });
    }

    // Return data which have less value compare to 'less'
    if (less) {
      query.andHaving('SUM(timeseries.confirmed) <= :less', { less });
    }

    // gives only first N data
    if (limit) {
      query.orderBy('SUM(timeseries.confirmed)', 'DESC');
      query.limit(limit);
    }

    const result = await query.groupBy('country.name').getRawMany();

    return result;
  }

  public async getTotalCases(date?: DateDto, countryCode?: string) {
    const fromDate = new Date(date.from);
    const toDate = new Date(date.to);
    let query = this.timeseriesRepo
      .createQueryBuilder('timeseries')
      .select('SUM(timeseries.confirmed)', 'total_confirmed')
      .addSelect('SUM(timeseries.deaths)', 'total_deaths')
      .addSelect('SUM(timeseries.recovered)', 'total_recovered')
      .innerJoin('timeseries.country', 'country');

    // filter the results by country code
    if (countryCode) {
      query = query.where('country.code = :countryCode', { countryCode });
    }

    // filter by date
    if (date.from != undefined) {
      query = query.andWhere('timeseries.date >= :fromDate', { fromDate });
    }

    if (date.to != undefined) {
      query = query.andWhere('timeseries.date <= :toDate', { toDate });
    }

    const timeSeriesData = await query.getRawOne();

    return timeSeriesData;
  }

  public async getMonthlyCases(
    greater?: number,
    date?: DateDto,
    less?: number,
  ) {
    const query = await this.timeseriesRepo
      .createQueryBuilder('timeseries')
      .select('country.name', 'name')
      .addSelect("DATE_FORMAT(timeseries.date, '%Y-%m')", 'month')
      .addSelect('SUM(timeseries.confirmed)', 'total_confirmed')
      .addSelect('SUM(timeseries.deaths)', 'total_deaths')
      .addSelect('SUM(timeseries.recovered)', 'total_recovered')
      .innerJoin('timeseries.country', 'country')
      .groupBy('country.name')
      .addGroupBy("DATE_FORMAT(timeseries.date, '%Y-%m')");

    if (date && date.from != undefined) {
      query.where('DATE(timeseries.date) BETWEEN :from AND :to', {
        from: date.from,
        to: date.to,
      });
    }
    if (greater !== undefined) {
      query.andHaving('SUM(timeseries.confirmed) >= :greater', { greater });
    }
    if (less !== undefined) {
      query.andHaving('SUM(timeseries.confirmed) <= :less', { less });
    }

    const result = await query.getRawMany();

    return result;
  }
}
