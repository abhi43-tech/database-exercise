import { Injectable } from '@nestjs/common';
import { TimeSeries } from '../entity/timeseries.entity';
import { Between, DataSource, Repository } from 'typeorm';
import { CountryRepository } from 'src/country/repository/country.repository';
import { Countries } from 'src/country/entity/country.entity';

@Injectable()
export class TimeseriesRepository extends Repository<TimeSeries> {
  constructor(
    private dataSource: DataSource,
  ) {
    super(TimeSeries, dataSource.createEntityManager());
  }

  public async findByCountry(country: Countries) {
    return await this.find({where: {country: country}})
  }

  public async findByDate(date: Date, country: Countries) {
    const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await this.findOne({
    where: {
      date: Between(startOfDay, endOfDay),
      country,
    },
  });
  }
}
