import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Countries } from "src/entity/country.entity";
import { TimeSeries } from "src/entity/timeseries.entity";
import { TimeSeriesService } from "./timeseries.service";
import { TimeSeriesController } from "./timeseries.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Countries, TimeSeries])],
  providers: [TimeSeriesService],
  controllers: [TimeSeriesController]
})
export class TimeSeriesModule {}