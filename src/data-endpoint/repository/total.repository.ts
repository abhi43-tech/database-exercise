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
      .select('timeseries.name', 'name')
      .addSelect('SUM(timeseries.confirmed)', 'confirmed')
      .addSelect('SUM(timeseries.deaths)', 'deaths')
      .addSelect('SUM(timeseries.recovered)', 'recovered')
      .groupBy('timeseries.name');

    if (condition) query.limit(condition);

    const result = await query.getRawMany();

    return result;
  }

  // filter by between two dates
  // filter by total confirmedcase is greater or less than a number 
  public async filter(date?: DateDto, iso?: string) {
      let filteredCountries = iso
        ? await this.countryRepo.find({
            where: { code: iso },
            select: ['name'],
          })
        : [];
      
        let condition: any = {}
      if(iso) condition.name = Not(In(filteredCountries))
      if(date.from != undefined) {condition.date = Raw(
        (alias) =>
          `STR_TO_DATE(${alias}, '%Y-%c-%e') BETWEEN '${date.from}' AND '${date.to}'`,
      )}
  
      return await this.find({
        where: condition
      });
    }
}
