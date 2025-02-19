import { Injectable } from '@nestjs/common';
import { DateDto } from '../dto/date.dto';
import { TimeseriesRepository } from 'src/timeseries/repository/timeseries.repo';

@Injectable()
export class CaseService {
  constructor(
    private readonly timeseriesRepo: TimeseriesRepository
  ) {}

  // Response contains total confirmed, deaths, recoverd
  // filter by two dates and ISO code
  public async getByFilter(
    date?: DateDto,
    greater?: number,
    less?: number,
    limit?: number,
  ) {
    // Query for sum all confirmed, deaths and recovered
    const query = await this.timeseriesRepo.createQueryBuilder('timeseries')
      .select('country.name', 'name')
      .addSelect('SUM(timeseries.confirmed)', 'total_confirmed')
      .addSelect('SUM(timeseries.deaths)', 'total_deaths')
      .addSelect('SUM(timeseries.recovered)', 'total_recovered')
      .innerJoin('timeseries.country', 'country')

    // gives only first N data
    if (limit) {query.limit(limit)};

    // filter data for given range of date
    if (date.from != undefined) {
      query.where(
        "DATE(timeseries.date) BETWEEN :from AND :to",
        { from: date.from, to: date.to },
      );
    }

    // Return data which have greater value compare to 'greater'
    if (greater) {
      query.andHaving('SUM(timeseries.confirmed) > :greater', { greater });
    }
    
    // Return data which have less value compare to 'less'
    if (less) {
      query.andHaving('SUM(timeseries.confirmed) < :less', { less });
    }

    const result = await query.groupBy('country.name').getRawMany();

    return result;
  }
}
