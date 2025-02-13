import { Injectable } from '@nestjs/common';
import { TimeSeries } from 'src/timeseries/entity/timeseries.entity';
import { DataSource, Repository } from 'typeorm';
import { DateDto } from '../dto/date.dto';

@Injectable()
export class CasesRepository extends Repository<TimeSeries> {
  constructor(private dataSource: DataSource) {
    super(TimeSeries, dataSource.createEntityManager());
  }

  // Return the filter data based on condition
  public async filter(
    date?: DateDto,
    greater?: number,
    less?: number,
    condition?: number,
  ) {
    // Query for sum all confirmed, deaths and recovered
    const query = await this.createQueryBuilder('timeseries')
      .select('timeseries.name', 'name')
      .addSelect('SUM(timeseries.confirmed)', 'total_confirmed')
      .addSelect('SUM(timeseries.deaths)', 'total_deaths')
      .addSelect('SUM(timeseries.recovered)', 'total_recovered');

    // gives only first N data
    if (condition) query.limit(condition);

    // filter data for given range of date
    if (date.from != undefined) {
      query.where(
        "STR_TO_DATE(timeseries.date, '%Y-%c-%e') BETWEEN :from AND :to",
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

    const result = await query.groupBy('timeseries.name').getRawMany();

    return result;
  }
}
