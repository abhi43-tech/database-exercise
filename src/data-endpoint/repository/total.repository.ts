import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Countries } from 'src/country/entity/country.entity';
import { TimeSeries } from 'src/timeseries/entity/timeseries.entity';
import { DataSource, In, Not, Raw, Repository } from 'typeorm';
import { DateDto } from '../dto/date.dto';

@Injectable()
export class TotalRepository extends Repository<TimeSeries> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Countries) private countryRepo: Repository<Countries>,
  ) {
    super(TimeSeries, dataSource.createEntityManager());
  }

  // Response contains total confirmed, total deaths, total recovered for each country
  public async get(condition?: number) {
    const query = await this.createQueryBuilder('timeseries')
      .select('SUM(timeseries.confirmed)', 'confirmed')
      .addSelect('SUM(timeseries.deaths)', 'deaths')
      .addSelect('SUM(timeseries.recovered)', 'recovered')
      .innerJoin('timeseries.country', 'country');

    if (condition) query.limit(condition);

    const result = await query.getRawMany();

    return result;
  }

  // filter by between two dates
  // filter by total confirmedcase is greater or less than a number
  public async filter(date?: DateDto, iso?: string) {
    const fromDate = new Date(date.from);
    const toDate = new Date(date.to);
    let filteredCountries = iso
      ? await this.countryRepo.find({
          where: { code: iso },
          select: ['id'],
        })
      : [];

    let condition: any = {};
    if (iso) condition.country = filteredCountries;
    if (date.from != undefined) {
      condition.date = Raw(
        (alias) => `DATE(${alias}) BETWEEN '${fromDate}' AND '${toDate}'`,
      );
    }

    return await this.find({
      where: condition,
    });
  }
}
