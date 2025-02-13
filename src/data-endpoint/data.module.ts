import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countries } from '../country/entity/country.entity';
import { TimeSeries } from '../timeseries/entity/timeseries.entity';
import { CaseController } from './controllers/cases.controller';
import { ExcelController } from './controllers/file.controller';
import { MonthController } from './controllers/month.controller';
import { TopController } from './controllers/top.controller';
import { TotalController } from './controllers/total.controller';
import { CaseService } from './services/cases.service';
import { ExcelService } from './services/file.service';
import { TopService } from './services/top.service';
import { TotalService } from './services/total.service';
import { MonthService } from './services/month.service';
import { CasesRepository } from './repository/cases.repository';
import { TotalRepository } from './repository/total.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Countries, TimeSeries])],
  controllers: [CaseController,ExcelController, MonthController, TopController, TotalController],
  providers: [CaseService, ExcelService, TopService, TotalService, MonthService, CasesRepository, TotalRepository],
})
export class DataModule {}
