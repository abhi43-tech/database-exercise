import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSeries } from '../../timeseries/entity/timeseries.entity';
import { DateDto } from '../dto/date.dto';

@Injectable()
export class MonthService {
  constructor(
    @InjectRepository(TimeSeries) private timeRepo: Repository<TimeSeries>,
  ) {}

  // Total of confirmed, deahs, recovered cases
  // filter by date and greater or less than a number
  public async get(greater?: number, date?: DateDto, less?: number) {
    const query = await this.timeRepo
      .createQueryBuilder('timeseries')
      .select('timeseries.name', 'name')
      .addSelect("DATE_FORMAT(timeseries.date, '%Y-%m')", 'month')
      .addSelect('SUM(timeseries.confirmed)', 'total_confirmed')
      .addSelect('SUM(timeseries.deaths)', 'total_deaths')
      .addSelect('SUM(timeseries.recovered)', 'total_recovered')
      .groupBy('timeseries.name')
      .addGroupBy("DATE_FORMAT(timeseries.date, '%Y-%m')");

    if (date && date.from != undefined) {
      query.where(
        "STR_TO_DATE(timeseries.date, '%Y-%c-%e') BETWEEN :from AND :to",
        { from: date.from, to: date.to },
      );
    }
    if (greater !== undefined) {
      query.andHaving('SUM(timeseries.confirmed) > :greater', { greater });
    }
    if (less !== undefined) {
      query.andHaving('SUM(timeseries.confirmed) < :less', { less });
    }

    const result = await query.getRawMany();

    return result;
  }
}
