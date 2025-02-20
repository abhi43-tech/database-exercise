import { Module } from '@nestjs/common';
import { ExcelService } from './services/file.service';
import { TimeseriesRepository } from 'src/timeseries/repository/timeseries.repo';
import { CountryRepository } from 'src/country/repository/country.repository';
import { TimseriesReportController } from './timeseries-report.controller';
import { TimeseriesReportService } from './services/timeseries-report.service';

@Module({
  imports: [],
  controllers: [TimseriesReportController],
  providers: [TimeseriesReportService, ExcelService, TimeseriesRepository, CountryRepository],
})
export class DataModule {}
