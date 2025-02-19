import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countries } from '../country/entity/country.entity';
import { TimeSeries } from './entity/timeseries.entity';
import { TimeSeriesService } from './timeseries.service';
import { TimeSeriesController } from './timeseries.controller';
import { TimePaginate } from '../pagination/timeseries.paginate.service';
import { TimeseriesRepository } from './repository/timeseries.repo';
import { CountryRepository } from 'src/country/repository/country.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Countries, TimeSeries])],
  providers: [TimeSeriesService, TimePaginate, TimeseriesRepository, CountryRepository],
  controllers: [TimeSeriesController],
})
export class TimeSeriesModule {}
