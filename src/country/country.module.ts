import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countries } from './entity/country.entity';
import { TimeSeries } from './../timeseries/entity/timeseries.entity';
import { DataSource } from 'typeorm';
import { PaginationService } from './../pagination/pagination.service';
import { CountryRepository } from './repository/country.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Countries, TimeSeries])],
  providers: [CountryService, PaginationService, CountryRepository],
  controllers: [CountryController],
})
export class CountryModule {
  constructor(public dataSource: DataSource) {}
}
